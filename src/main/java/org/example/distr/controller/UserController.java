package org.example.distr.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.UserRequest;
import org.example.distr.dto.response.UserResponse;
import org.example.distr.entity.enums.UserType;
import org.example.distr.exception.BusinessLogicException;
import org.example.distr.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(required = false) String type) {
        if (type != null) {
            try {
                UserType userType = UserType.valueOf(type.toUpperCase());
                List<UserResponse> response = userService.getUsersByType(userType);
                return ResponseEntity.ok(response);
            } catch (IllegalArgumentException e) {
                throw new BusinessLogicException("Invalid user type: " + type);
            }
        } else {
            List<UserResponse> response = userService.getAllUsers();
            return ResponseEntity.ok(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}