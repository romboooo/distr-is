package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.ModerationRequest;
import org.example.distr.dto.response.ModerationResponse;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.ReleaseResponse;
import org.example.distr.entity.Moderator;
import org.example.distr.entity.OnModeration;
import org.example.distr.entity.Release;
import org.example.distr.entity.enums.ModerationState;
import org.example.distr.exception.BusinessLogicException;
import org.example.distr.exception.ResourceNotFoundException;
import org.example.distr.repository.ModeratorRepository;
import org.example.distr.repository.OnModerationRepository;
import org.example.distr.repository.ReleaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ModerationService {

    private final ReleaseRepository releaseRepository;
    private final ModeratorRepository moderatorRepository;
    private final OnModerationRepository onModerationRepository;
    private final ReleaseService releaseService;

    @Transactional(readOnly = true)
    public PageResponse<ReleaseResponse> getPendingReleases(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        // Получаем релизы в статусе ON_MODERATION (ожидающие модерации)
        Page<Release> releasePage = releaseRepository.findByModerationState(ModerationState.ON_MODERATION, pageable);

        List<ReleaseResponse> content = releasePage.getContent().stream()
                .map(releaseService::mapToResponse)
                .toList();

        PageResponse<ReleaseResponse> response = new PageResponse<>();
        response.setContent(content);
        response.setCurrentPage(releasePage.getNumber());
        response.setTotalPages(releasePage.getTotalPages());
        response.setTotalElements(releasePage.getTotalElements());
        response.setPageSize(releasePage.getSize());

        return response;
    }

    @Transactional
    public ModerationResponse moderateRelease(ModerationRequest request) {
        Release release = releaseRepository.findById(request.getReleaseId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Release not found with id: " + request.getReleaseId()));

        if (release.getModerationState() != ModerationState.ON_REVIEW
                && release.getModerationState() != ModerationState.ON_MODERATION) {
            throw new BusinessLogicException(
                    "Release cannot be moderated. Current state: " + release.getModerationState());
        }

        Moderator moderator = moderatorRepository.findById(request.getModeratorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Moderator not found with id: " + request.getModeratorId()));

        if (request.getModerationState() == ModerationState.ON_REVIEW
                || request.getModerationState() == ModerationState.ON_MODERATION) {
            throw new BusinessLogicException(
                    "Cannot set moderation state to " + request.getModerationState() + " after moderation");
        }

        if (request.getModerationState() == ModerationState.DRAFT) {
            throw new BusinessLogicException("Cannot set moderation state to DRAFT after moderation");
        }

        release.setModerationState(request.getModerationState());
        Release savedRelease = releaseRepository.save(release);

        OnModeration moderationRecord = OnModeration.builder()
                .comment(request.getComment())
                .moderator(moderator)
                .release(savedRelease)
                .date(LocalDateTime.now())
                .build();

        OnModeration savedRecord = onModerationRepository.save(moderationRecord);

        return mapToModerationResponse(savedRecord);
    }

    private ModerationResponse mapToModerationResponse(OnModeration onModeration) {
        ModerationResponse response = new ModerationResponse();
        response.setId(onModeration.getId());
        response.setComment(onModeration.getComment());
        response.setModeratorId(onModeration.getModerator().getId());
        response.setModeratorName(onModeration.getModerator().getName());
        response.setReleaseId(onModeration.getRelease().getId());
        response.setReleaseName(onModeration.getRelease().getName());
        response.setDate(onModeration.getDate());
        return response;
    }

    @Transactional(readOnly = true)
    public List<ModerationResponse> getModerationHistory(Long releaseId) {
        List<OnModeration> records = onModerationRepository.findByReleaseId(releaseId);
        return records.stream()
                .map(this::mapToModerationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Long getModeratorIdByUserId(Long userId) {
        return moderatorRepository.findByUserId(userId)
                .map(Moderator::getId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No moderator found for user ID: " + userId));
    }
}
