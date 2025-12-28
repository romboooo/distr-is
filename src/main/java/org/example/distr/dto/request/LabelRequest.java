package org.example.distr.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class LabelRequest {
    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "User ID is required")
    private Long userId;
}