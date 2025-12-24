package org.example.distr.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class SongResponse {
    private Long id;
    private Long releaseId;
    private String releaseName;
    private List<Long> artistIds;
    private List<String> artistNames;
    private String musicAuthor;
    private Boolean parentalAdvisory;
    private Long streams;
    private Long songUpc;
    private String metadata;
    private String pathToFile;
    private Integer songLengthSeconds;
}