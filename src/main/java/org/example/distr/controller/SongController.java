package org.example.distr.controller;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.SongResponse;
import org.example.distr.service.MinioService;
import org.example.distr.service.SongService;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.TagException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import io.minio.StatObjectResponse;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;

@RestController
@RequestMapping("/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;
    private final MinioService minioService;

    private static final Set<String> ALLOWED_AUDIO_CONTENT_TYPES = Set.of(
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/x-wav",
            "audio/wave",
            "audio/aac",
            "audio/mp4",
            "audio/ogg",
            "audio/flac",
            "audio/x-flac");

    private final Logger logger = LoggerFactory.getLogger(SongController.class);

    @GetMapping("/{id}")
    public ResponseEntity<SongResponse> getSong(@PathVariable Long id) {
        SongResponse response = songService.getSong(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<SongResponse>> getAllSongs(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        PageResponse<SongResponse> response = songService.getAllSongs(pageNumber, pageSize);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{songId}/file")
    public ResponseEntity<String> uploadSongFile(
            @PathVariable Long songId,
            @RequestParam("file") MultipartFile file) throws Exception {

        validateAudioFile(file);

        // Create secure temp file
        Path tempPath = Files.createTempFile("audio_", "_" + cleanFileName(file.getOriginalFilename()));
        File tempFile = tempPath.toFile();

        try {
            // Transfer to OUR temp file (invalidates original MultipartFile)
            file.transferTo(tempFile);

            // Get duration from OUR temp file
            int durationInSeconds = extractDuration(tempFile);

            String fileName = minioService.generateSongFileName(songId, file.getOriginalFilename());
            // Upload OUR temp file instead of original MultipartFile
            String path = minioService.uploadFile(minioService.getSongsBucket(), fileName, tempFile);

            songService.updateSongFileAndDuration(songId, path, durationInSeconds);
            return ResponseEntity.ok(path);
        } finally {
            // Always clean up temp file
            try {
                Files.deleteIfExists(tempPath);
            } catch (IOException e) {
                logger.error("Failed to delete temp file: {}", tempPath, e);
            }
        }
    }

    // Helper to sanitize filenames
    private String cleanFileName(String fileName) {
        return fileName.replaceAll("[\\\\/:*?\"<>|]", "_");
    }

    private int extractDuration(File audioFile) throws Exception {
        try {
            AudioFile file = AudioFileIO.read(audioFile);
            return file.getAudioHeader().getTrackLength(); // Returns duration in seconds
        } catch (CannotReadException | ReadOnlyFileException | InvalidAudioFrameException | TagException
                | IOException e) {
            throw new IllegalArgumentException("Invalid audio file: " + e.getMessage(), e);
        }
    }

    private void validateAudioFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_AUDIO_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only audio files of allowed types are allowed");
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<StreamingResponseBody> downloadSong(@PathVariable Long id) {
        SongResponse song = songService.getSong(id);
        if (song == null || song.getPathToFile() == null) {
            return ResponseEntity.notFound().build();
        }

        String bucket = minioService.getSongsBucket();
        String objectName = song.getPathToFile();

        StatObjectResponse stat;
        try {
            stat = minioService.statObject(bucket, objectName);
        } catch (Exception e) {
            logger.error("File not found in MinIO: {}/{}", bucket, objectName, e);
            return ResponseEntity.notFound().build();
        }

        try {
            StreamingResponseBody stream = outputStream -> {
                try (InputStream inputStream = minioService.downloadFile(bucket, objectName)) {
                    byte[] buffer = new byte[8192]; // 8KB buffer
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                } catch (Exception e) {
                    logger.error("Error streaming file: {}/{}", bucket, objectName, e);
                    throw new RuntimeException("Failed to stream file content", e);
                }
            };

            // Generate safe filename for download
            String originalFilename = extractFilename(objectName);
            ContentDisposition disposition = ContentDisposition.builder("attachment")
                    .filename(originalFilename, StandardCharsets.UTF_8)
                    .build();

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(stat.contentType()))
                    .contentLength(stat.size())
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                    .body(stream);
        } catch (Exception e) {
            logger.error("Error preparing download for song ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String extractFilename(String objectName) {
        int lastUnderscore = objectName.lastIndexOf('_');
        int lastDot = objectName.lastIndexOf('.');
        if (lastUnderscore == -1 || lastDot == -1 || lastUnderscore > lastDot) {
            return objectName; // Fallback to original name if pattern not matched
        }
        String baseName = objectName.substring(0, lastUnderscore);
        String extension = objectName.substring(lastDot);
        return baseName + extension;
    }
}
