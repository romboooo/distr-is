package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.UpdateUserRequest;
import org.example.distr.dto.request.UserRequest;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.UserResponse;
import org.example.distr.entity.enums.UserType;
import org.example.distr.exception.BusinessLogicException;
import org.example.distr.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        UserResponse response = userService.getUser(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/login/{login}")
    public ResponseEntity<UserResponse> getUserByLogin(@PathVariable String login) {
        UserResponse response = userService.getUserByLogin(login);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<UserResponse>> getUsersByType(@PathVariable UserType type) {
        List<UserResponse> response = userService.getUsersByType(type);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {

        if (type != null) {
            try {
                UserType userType = UserType.valueOf(type.toUpperCase());
                List<UserResponse> response = userService.getUsersByType(userType);
                PageResponse<UserResponse> pageResponse = new PageResponse<>();
                pageResponse.setContent(response);
                pageResponse.setCurrentPage(0);
                pageResponse.setTotalPages(1);
                pageResponse.setTotalElements(response.size());
                pageResponse.setPageSize(response.size());
                return ResponseEntity.ok(pageResponse);
            } catch (IllegalArgumentException e) {
                throw new BusinessLogicException("Invalid user type: " + type);
            }
        } else {
            PageResponse<UserResponse> response = userService.getAllUsers(pageNumber, pageSize);
            return ResponseEntity.ok(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }
}