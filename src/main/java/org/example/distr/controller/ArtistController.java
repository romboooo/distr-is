package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.ArtistRequest;
import org.example.distr.dto.response.ArtistResponse;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.ReleaseResponse;
import org.example.distr.service.ArtistService;
import org.example.distr.service.ReleaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/artists")
@RequiredArgsConstructor
public class ArtistController {
    private final ArtistService artistService;
    private final ReleaseService releaseService;

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
    public ResponseEntity<PageResponse<ArtistResponse>> getAllArtists(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        PageResponse<ArtistResponse> response = artistService.getAllArtists(pageNumber, pageSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<ArtistResponse> getArtistByUserId(@PathVariable Long userId) {
        ArtistResponse response = artistService.getArtistByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{artistId}/releases")
    public ResponseEntity<PageResponse<ReleaseResponse>> getReleasesByArtist(
            @PathVariable Long artistId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {

        // Validate artist exists (throws 404 if not found)
        artistService.getArtist(artistId);

        // Fetch paginated releases
        PageResponse<ReleaseResponse> response = releaseService.getReleasesByArtist(artistId, pageNumber, pageSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-label/{labelId}")
    public ResponseEntity<PageResponse<ArtistResponse>> getArtistsByLabel(
            @PathVariable Long labelId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {

        PageResponse<ArtistResponse> response = artistService.getArtistsByLabel(labelId, pageNumber, pageSize);
        return ResponseEntity.ok(response);
    }
}
