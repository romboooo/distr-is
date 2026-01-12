package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.io.InputStream;
import java.util.List;

import org.example.distr.dto.request.*;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.ReleaseResponse;
import org.example.distr.dto.response.SongResponse;
import org.example.distr.service.MinioService;
import org.example.distr.service.ReleaseService;
import org.example.distr.service.SongService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

@RestController
@RequestMapping("/releases")
@RequiredArgsConstructor
public class ReleaseController {
    private final ReleaseService releaseService;
    private final SongService songService;
    private final MinioService minioService;

    @PostMapping("/draft")
    public ResponseEntity<ReleaseResponse> createDraftRelease(@Valid @RequestBody DraftReleaseRequest request) {
        ReleaseResponse response = releaseService.createDraftRelease(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReleaseResponse> getRelease(@PathVariable Long id) {
        ReleaseResponse response = releaseService.getRelease(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<ReleaseResponse>> getAllReleases(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        PageResponse<ReleaseResponse> response = releaseService.getAllReleases(pageNumber, pageSize);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{releaseId}/songs")
    public ResponseEntity<SongResponse> addSongToRelease(
            @PathVariable Long releaseId,
            @Valid @RequestBody AddSongRequest request) throws JsonMappingException, JsonProcessingException {
        SongResponse response = songService.addSongToRelease(releaseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{releaseId}/songs")
    public ResponseEntity<List<SongResponse>> getSongsByRelease(@PathVariable Long releaseId) {
        releaseService.getRelease(releaseId);

        List<SongResponse> songs = songService.getSongsByRelease(releaseId);
        return ResponseEntity.ok(songs);
    }

    @PostMapping("/songs/{songId}/file")
    public ResponseEntity<String> uploadSongFile(
            @PathVariable Long songId,
            @RequestParam("file") MultipartFile file) throws Exception {

        validateMp3File(file);

        String fileName = minioService.generateSongFileName(songId, file.getOriginalFilename());
        String path = minioService.uploadFile(minioService.getSongsBucket(), fileName, file);

        songService.updateSongFile(songId, path);
        return ResponseEntity.ok(path);
    }

    @PostMapping("/{releaseId}/cover")
    public ResponseEntity<String> uploadCover(
            @PathVariable Long releaseId,
            @RequestParam("file") MultipartFile file) throws Exception {

        validateImageFile(file);

        String fileName = minioService.generateCoverFileName(releaseId, file.getOriginalFilename());
        String path = minioService.uploadFile(minioService.getCoversBucket(), fileName, file);

        releaseService.updateReleaseCover(releaseId, path);
        return ResponseEntity.ok(path);
    }

    @GetMapping("/{releaseId}/cover")
    public ResponseEntity<InputStreamResource> getCoverImage(@PathVariable Long releaseId) throws Exception {
        ReleaseResponse release = releaseService.getRelease(releaseId);
        String coverPath = release.getCoverPath();

        if (coverPath == null || coverPath.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        InputStream inputStream = minioService.downloadFile(minioService.getCoversBucket(), coverPath);
        String contentType = minioService.getFileContentType(minioService.getCoversBucket(), coverPath);

        InputStreamResource resource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(inputStream.available())
                .body(resource);
    }

    @PostMapping("/{releaseId}/request-moderation")
    public ResponseEntity<ReleaseResponse> requestModeration(@PathVariable Long releaseId) {
        ReleaseResponse response = releaseService.requestModeration(releaseId);
        return ResponseEntity.ok(response);
    }

    private void validateMp3File(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("audio/mpeg")) {
            throw new IllegalArgumentException("Only MP3 files are allowed");
        }
    }

    private void validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed for covers");
        }
    }
}
