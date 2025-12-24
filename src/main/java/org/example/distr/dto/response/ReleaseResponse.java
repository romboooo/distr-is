package org.example.distr.dto.response;

import lombok.Data;
import org.example.distr.entity.enums.ModerationState;
import org.example.distr.entity.enums.ReleaseType;

import java.time.LocalDateTime;

@Data
public class ReleaseResponse {
    private Long id;
    private String name;
    private Long artistId;
    private String artistName;
    private String genre;
    private Long releaseUpc;
    private LocalDateTime date;
    private ModerationState moderationState;
    private ReleaseType releaseType;
    private Long labelId;
    private String labelName;
}