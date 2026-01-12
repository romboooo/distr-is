package org.example.distr.dto.request;

import lombok.Data;
import org.example.distr.entity.enums.ModerationState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class ModerationRequest {
    @NotNull(message = "Release ID is required")
    private Long releaseId;

    @NotNull(message = "Moderator ID is required")
    private Long moderatorId;

    @NotBlank(message = "Comment is required")
    private String comment;

    @NotNull(message = "Moderation state is required")
    private ModerationState moderationState;
}