package org.example.distr.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class ArtistRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Label ID is required")
    private Long labelId;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Real name is required")
    private String realName;

    @NotNull(message = "User ID is required")
    private Long userId;
}