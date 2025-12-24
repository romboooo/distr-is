package org.example.distr.dto.response;

import lombok.Data;

@Data
public class ArtistResponse {
    private Long id;
    private String name;
    private Long labelId;
    private String labelName;
    private String country;
    private String realName;
    private Long userId;
    private String userLogin;
}