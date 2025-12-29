package org.example.distr.dto.response;

import lombok.Data;
@Data
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserResponse user;
}
