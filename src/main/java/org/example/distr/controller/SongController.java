package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.SongRequest;
import org.example.distr.dto.response.SongResponse;
import org.example.distr.service.SongService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

    @PostMapping
    public ResponseEntity<SongResponse> createSong(@Valid @RequestBody SongRequest request) {
        SongResponse response = songService.createSong(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SongResponse> getSong(@PathVariable Long id) {
        SongResponse response = songService.getSong(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SongResponse>> getAllSongs() {
        List<SongResponse> response = songService.getAllSongs();
        return ResponseEntity.ok(response);
    }
}