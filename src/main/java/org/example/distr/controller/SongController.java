package org.example.distr.controller;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.SongResponse;
import org.example.distr.service.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

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
}
