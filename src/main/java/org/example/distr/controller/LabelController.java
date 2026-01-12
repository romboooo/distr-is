package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.LabelRequest;
import org.example.distr.dto.response.LabelResponse;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.service.LabelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/labels")
@RequiredArgsConstructor
public class LabelController {
    private final LabelService labelService;

    @PostMapping
    public ResponseEntity<LabelResponse> createLabel(@Valid @RequestBody LabelRequest request) {
        LabelResponse response = labelService.createLabel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabelResponse> getLabel(@PathVariable Long id) {
        LabelResponse response = labelService.getLabel(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<LabelResponse>> getAllLabels(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        PageResponse<LabelResponse> response = labelService.getAllLabels(pageNumber, pageSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<LabelResponse> getLabelByUserId(@PathVariable Long userId) {
        LabelResponse response = labelService.getLabelByUserId(userId);
        return ResponseEntity.ok(response);
    }
}
