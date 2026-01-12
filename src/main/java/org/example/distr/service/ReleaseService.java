package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.DraftReleaseRequest;
import org.example.distr.dto.request.UpdateReleaseRequest;
import org.example.distr.dto.response.ReleaseResponse;
import org.example.distr.entity.Release;
import org.example.distr.entity.Artist;
import org.example.distr.entity.Label;
import org.example.distr.entity.User;
import org.example.distr.entity.enums.ModerationState;
import org.example.distr.entity.enums.UserType;
import org.example.distr.exception.BusinessLogicException;
import org.example.distr.exception.ResourceNotFoundException;
import org.example.distr.repository.ReleaseRepository;
import org.example.distr.repository.ArtistRepository;
import org.example.distr.repository.LabelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.distr.dto.response.PageResponse;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReleaseService {
    private final ReleaseRepository releaseRepository;
    private final ArtistRepository artistRepository;
    private final LabelRepository labelRepository;
    private final UpcGeneratorService upcGeneratorService;

    @Transactional
    public ReleaseResponse createDraftRelease(DraftReleaseRequest request) {
        Artist artist = artistRepository.findById(request.getArtistId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));

        Label label = labelRepository.findById(request.getLabelId())
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));

        Long releaseUpc = generateUpc();

        Release release = Release.builder()
                .name(request.getName())
                .artist(artist)
                .genre(request.getGenre())
                .releaseUpc(releaseUpc)
                .moderationState(ModerationState.DRAFT)
                .releaseType(request.getReleaseType())
                .label(label)
                .coverPath(null)
                .build();

        Release saved = releaseRepository.save(release);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public ReleaseResponse getRelease(Long id) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));
        return mapToResponse(release);
    }

    @Transactional(readOnly = true)
    public Release getReleaseById(Long id) {
        return releaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));
    }

    @Transactional(readOnly = true)
    public List<ReleaseResponse> getReleasesByArtist(Long artistId) {
        return releaseRepository.findByArtistId(artistId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReleaseResponse> getReleasesByModerationState(ModerationState state) {
        return releaseRepository.findByModerationState(state).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReleaseResponse> getReleasesByLabel(Long labelId) {
        return releaseRepository.findByLabelId(labelId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ReleaseResponse updateModerationState(Long releaseId, ModerationState state) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));

        release.setModerationState(state);
        Release updated = releaseRepository.save(release);
        return mapToResponse(updated);
    }

    @Transactional
    public ReleaseResponse updateReleaseCover(Long releaseId, String coverPath) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));

        release.setCoverPath(coverPath);
        Release updated = releaseRepository.save(release);
        return mapToResponse(updated);
    }

    private Long generateUpc() {
        // More robust UPC generation
        return 600000000000L + (System.currentTimeMillis() % 400000000000L);
    }

    @Transactional(readOnly = true)
    public List<ReleaseResponse> getAllReleases() {
        return releaseRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<ReleaseResponse> getAllReleases(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Release> releasePage = releaseRepository.findAll(pageable);

        List<ReleaseResponse> content = releasePage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        PageResponse<ReleaseResponse> response = new PageResponse<>();
        response.setContent(content);
        response.setCurrentPage(releasePage.getNumber());
        response.setTotalPages(releasePage.getTotalPages());
        response.setTotalElements(releasePage.getTotalElements());
        response.setPageSize(releasePage.getSize());

        return response;
    }

    // В ReleaseService, в методе requestModeration:
    public ReleaseResponse requestModeration(Long releaseId) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));

        if (release.getCoverPath() == null) {
            throw new IllegalStateException("Cover image must be uploaded before moderation");
        }

        if (release.getSongs().stream().anyMatch(song -> song.getPathToFile() == null)) {
            throw new IllegalStateException("All songs must have uploaded files before moderation");
        }

        if (release.getReleaseUpc() == null) {
            release.setReleaseUpc(upcGeneratorService.generateUpc());
        }

        release.setModerationState(ModerationState.ON_MODERATION);
        Release savedRelease = releaseRepository.save(release);

        return mapToResponse(savedRelease);
    }

    ReleaseResponse mapToResponse(Release release) {
        return ReleaseResponse.builder()
                .id(release.getId())
                .name(release.getName())
                .genre(release.getGenre())
                .artistId(release.getArtist().getId())
                .labelId(release.getLabel().getId())
                .releaseUpc(release.getReleaseUpc())
                .date(release.getDate())
                .moderationState(release.getModerationState())
                .releaseType(release.getReleaseType())
                .coverPath(release.getCoverPath())
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<ReleaseResponse> getReleasesByArtist(Long artistId, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Release> releasePage = releaseRepository.findByArtistId(artistId, pageable);

        List<ReleaseResponse> content = releasePage.getContent().stream()
                .map(this::mapToResponse)
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
    public ReleaseResponse updateRelease(Long id, UpdateReleaseRequest request, User currentUser) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));

        boolean hasAccess = false;

        if (currentUser.getType() == UserType.ADMIN) {
            hasAccess = true;
        } else if (currentUser.getType() == UserType.ARTIST) {
            Artist artist = artistRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Artist not found for current user"));
            hasAccess = release.getArtist().getId().equals(artist.getId());
        } else if (currentUser.getType() == UserType.LABEL) {
            Label label = labelRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Label not found for current user"));
            hasAccess = release.getLabel().getId().equals(label.getId());
        }

        if (!hasAccess) {
            throw new BusinessLogicException("You don't have permission to update this release");
        }

        if (request.getName() != null && !request.getName().isEmpty()) {
            release.setName(request.getName());
        }

        if (request.getGenre() != null && !request.getGenre().isEmpty()) {
            release.setGenre(request.getGenre());
        }

        if (request.getDate() != null) {
            release.setDate(request.getDate());
        }

        if (request.getReleaseType() != null) {
            release.setReleaseType(request.getReleaseType());
        }

        Release updated = releaseRepository.save(release);
        return mapToResponse(updated);
    }
}
