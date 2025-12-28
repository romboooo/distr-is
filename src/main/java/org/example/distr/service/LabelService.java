package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.LabelRequest;
import org.example.distr.dto.response.LabelResponse;
import org.example.distr.entity.Label;
import org.example.distr.entity.User;
import org.example.distr.exception.ResourceNotFoundException;
import org.example.distr.repository.LabelRepository;
import org.example.distr.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelService {
    private final LabelRepository labelRepository;
    private final UserRepository userRepository;

    @Transactional
    public LabelResponse createLabel(LabelRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Label label = Label.builder()
                .country(request.getCountry())
                .contactName(request.getContactName())
                .phone(request.getPhone())
                .user(user)
                .build();

        Label saved = labelRepository.save(label);
        return mapToResponse(saved);
    }

    public LabelResponse getLabel(Long id) {
        Label label = labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));
        return mapToResponse(label);
    }

    public List<LabelResponse> getAllLabels() {
        return labelRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LabelResponse mapToResponse(Label label) {
        LabelResponse response = new LabelResponse();
        response.setId(label.getId());
        response.setCountry(label.getCountry());
        response.setContactName(label.getContactName());
        response.setPhone(label.getPhone());
        response.setUserId(label.getUser().getId());
        response.setUserLogin(label.getUser().getLogin());
        return response;
    }
}