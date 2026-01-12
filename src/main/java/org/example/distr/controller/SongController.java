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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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

    private Logger logger = LoggerFactory.getLogger(MinioService.class);

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
        if (contentType == null || !contentType.equals("audio/mpeg")) {
            throw new IllegalArgumentException("Only audio files are allowed");
        }
    }
}
