package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.entity.User;
import org.example.distr.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String login = authentication.getName();
        return userRepository.findByLogin(login).orElse(null);
    }

    public boolean isAdmin() {
        User user = getCurrentUser();
        return user != null && user.getType().name().equals("ADMIN");
    }

    public boolean isModerator() {
        User user = getCurrentUser();
        return user != null && user.getType().name().equals("MODERATOR");
    }

    public boolean isAuthenticated() {
        return getCurrentUser() != null;
    }

    public Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }
}