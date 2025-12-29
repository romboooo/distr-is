package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.UserRequest;
import org.example.distr.dto.response.UserResponse;
import org.example.distr.entity.User;
import org.example.distr.entity.enums.UserType;
import org.example.distr.exception.BusinessLogicException;
import org.example.distr.exception.ResourceAlreadyExistsException;
import org.example.distr.exception.ResourceNotFoundException;
import org.example.distr.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByLogin(request.getLogin())) {
            throw new ResourceAlreadyExistsException("User with login '" + request.getLogin() + "' already exists");
        }

        checkCreatePermission(request.getType());

        User user = new User();
        user.setLogin(request.getLogin());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setType(request.getType());

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    private void checkCreatePermission(UserType requestedType) {
        User currentUser = currentUserService.getCurrentUser();
        UserType currentUserType = currentUser != null ? currentUser.getType() : null;

        switch (requestedType) {
            case ARTIST:
            case LABEL:
                break;

            case MODERATOR:
                if (currentUserType != UserType.ADMIN && currentUserType != UserType.MODERATOR) {
                    throw new BusinessLogicException("Only ADMIN or MODERATOR can create MODERATOR users");
                }
                break;

            case ADMIN:
                if (currentUserType != UserType.ADMIN) {
                    throw new BusinessLogicException("Only ADMIN can create ADMIN users");
                }
                break;

            case PLATFORM:
                if (currentUserType != UserType.ADMIN) {
                    throw new BusinessLogicException("Only ADMIN can create PLATFORM users");
                }
                break;

            default:
                throw new BusinessLogicException("Unknown user type: " + requestedType);
        }
    }

    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToResponse(user);
    }

    public UserResponse getUserByLogin(String login) {
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with login: " + login));
        return mapToResponse(user);
    }

    public User getUserEntityByLogin(String login) {
        return userRepository.findByLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with login: " + login));
    }

    public List<UserResponse> getUsersByType(UserType type) {
        return userRepository.findByType(type).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        User currentUser = currentUserService.getCurrentUser();
        if (currentUser == null) {
            throw new BusinessLogicException("Authentication required");
        }

        if (currentUser.getType() != UserType.ADMIN && !currentUser.getId().equals(id)) {
            throw new BusinessLogicException("You can only delete your own account or have ADMIN rights");
        }

        userRepository.deleteById(id);
    }

    public UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setLogin(user.getLogin());
        response.setType(user.getType());
        response.setRegistrationDate(user.getRegistrationDate());
        return response;
    }
}