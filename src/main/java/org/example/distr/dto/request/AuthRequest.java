package org.example.distr.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank(message = "Login is required")
    private String login;
    @NotBlank(message = "Login is required")
    private String password;
}
