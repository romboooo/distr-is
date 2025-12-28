package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.ReleaseRequest;
import org.example.distr.dto.response.ReleaseResponse;
import org.example.distr.service.ReleaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/releases")
@RequiredArgsConstructor
public class ReleaseController {
    private final ReleaseService releaseService;

    @PostMapping
    public ResponseEntity<ReleaseResponse> createRelease(@Valid @RequestBody ReleaseRequest request) {
        ReleaseResponse response = releaseService.createRelease(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReleaseResponse> getRelease(@PathVariable Long id) {
        ReleaseResponse response = releaseService.getRelease(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ReleaseResponse>> getAllReleases() {
        List<ReleaseResponse> response = releaseService.getAllReleases();
        return ResponseEntity.ok(response);
    }
}