package org.example.distr.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ModerationResponse {
    private Long id;
    private String comment;
    private Long moderatorId;
    private String moderatorName;
    private Long releaseId;
    private String releaseName;
    private LocalDateTime date;
}