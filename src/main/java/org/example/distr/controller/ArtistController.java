package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.ArtistRequest;
import org.example.distr.dto.response.ArtistResponse;
import org.example.distr.service.ArtistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artists")
@RequiredArgsConstructor
public class ArtistController {
    private final ArtistService artistService;

    @PostMapping
    public ResponseEntity<ArtistResponse> createArtist(@Valid @RequestBody ArtistRequest request) {
        ArtistResponse response = artistService.createArtist(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistResponse> getArtist(@PathVariable Long id) {
        ArtistResponse response = artistService.getArtist(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ArtistResponse>> getAllArtists() {
        List<ArtistResponse> response = artistService.getAllArtists();
        return ResponseEntity.ok(response);
    }
}