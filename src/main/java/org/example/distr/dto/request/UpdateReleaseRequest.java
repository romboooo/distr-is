package org.example.distr.dto.request;

import lombok.Data;
import org.example.distr.entity.enums.ReleaseType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Data
public class UpdateReleaseRequest {
    private String name;

    private String genre;

    private LocalDateTime date;

    private ReleaseType releaseType;
}