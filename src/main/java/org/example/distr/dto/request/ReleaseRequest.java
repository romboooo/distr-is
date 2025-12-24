package org.example.distr.dto.request;

import lombok.Data;
import org.example.distr.entity.enums.ReleaseType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class ReleaseRequest {
    @NotBlank(message = "Release name is required")
    private String name;

    @NotNull(message = "Artist ID is required")
    @Positive(message = "Artist ID must be positive")
    private Long artistId;

    @NotBlank(message = "Genre is required")
    private String genre;

    @NotNull(message = "Release type is required")
    private ReleaseType releaseType;

    @NotNull(message = "Label ID is required")
    @Positive(message = "Label ID must be positive")
    private Long labelId;
}