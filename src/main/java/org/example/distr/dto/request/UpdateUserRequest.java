package org.example.distr.dto.request;

import lombok.Data;
import org.example.distr.entity.enums.UserType;
import jakarta.validation.constraints.Size;

@Data
public class UpdateUserRequest {
    @Size(min = 3, max = 50, message = "Login must be between 3 and 50 characters")
    private String login;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private UserType type;
}