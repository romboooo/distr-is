package org.example.distr.dto.response;

import lombok.Data;
import org.example.distr.entity.enums.UserType;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String login;
    private UserType type;
    private LocalDateTime registrationDate;
}