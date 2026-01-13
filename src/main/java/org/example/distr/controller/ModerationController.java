package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.ModerationRequest;
import org.example.distr.dto.response.ModerationResponse;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.ReleaseResponse;
import org.example.distr.service.ModerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/moderation")
@RequiredArgsConstructor
public class ModerationController {

    private final ModerationService moderationService;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<PageResponse<ReleaseResponse>> getPendingReleases(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        PageResponse<ReleaseResponse> response = moderationService.getPendingReleases(pageNumber, pageSize);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<ModerationResponse> moderateRelease(
            @Valid @RequestBody ModerationRequest request) {
        ModerationResponse response = moderationService.moderateRelease(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/history/{releaseId}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('LABEL') or hasRole('ARTIST')")
    public ResponseEntity<List<ModerationResponse>> getModerationHistory(@PathVariable Long releaseId) {
        List<ModerationResponse> response = moderationService.getModerationHistory(releaseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/moderator-id-by-user-id/{userId}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Long> getModeratorIdByUserId(@PathVariable Long userId) {
        Long moderatorId = moderationService.getModeratorIdByUserId(userId);
        return ResponseEntity.ok(moderatorId);
    }
}
