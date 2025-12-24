package org.example.distr.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Data
public class SongRequest {
    @NotNull(message = "Release ID is required")
    @Positive(message = "Release ID must be positive")
    private Long releaseId;

    private List<Long> artistIds;

    @NotBlank(message = "Music author is required")
    private String musicAuthor;

    @NotNull(message = "Parental advisory flag is required")
    private Boolean parentalAdvisory;

    @NotNull(message = "Song UPC is required")
    @Positive(message = "Song UPC must be positive")
    private Long songUpc;

    private String metadata; // wip JSON

    @NotBlank(message = "Path to file is required")
    private String pathToFile;

    @NotNull(message = "Song length is required")
    @Positive(message = "Song length must be positive")
    private Integer songLengthSeconds;
}