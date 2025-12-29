package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.AuthRequest;
import org.example.distr.dto.response.AuthResponse;
import org.example.distr.dto.response.UserResponse;
import org.example.distr.exception.BusinessLogicException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final UserService userService;

    public AuthResponse authenticate(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getLogin(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtService.generateToken(userDetails);

            UserResponse userResponse = userService.getUserByLogin(request.getLogin());

            AuthResponse response = new AuthResponse();
            response.setToken(jwt);
            response.setUser(userResponse);

            return response;
        } catch (Exception e) {
            throw new BusinessLogicException("Invalid login or password");
        }
    }

    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserByLogin(username);
    }
}