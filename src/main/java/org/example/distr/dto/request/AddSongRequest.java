package org.example.distr.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Data
public class AddSongRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Release ID is required")
    @Positive(message = "Release ID must be positive")
    private Long releaseId;

    @NotNull(message = "Release ID is required")
    private List<Long> artistIds;

    @NotBlank(message = "Music author is required")
    private String musicAuthor;

    @NotNull(message = "Parental advisory flag is required")
    private Boolean parentalAdvisory;

    private String metadata; // wip JSON
}
