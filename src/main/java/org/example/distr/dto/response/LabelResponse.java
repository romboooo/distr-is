package org.example.distr.dto.response;

import lombok.Data;

@Data
public class LabelResponse {
    private Long id;
    private String country;
    private String contactName;
    private String phone;
    private Long userId;
    private String userLogin;
}