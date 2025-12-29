package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.ReleaseRequest;
import org.example.distr.dto.response.ReleaseResponse;
import org.example.distr.entity.Release;
import org.example.distr.entity.Artist;
import org.example.distr.entity.Label;
import org.example.distr.entity.enums.ModerationState;
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

    @Transactional
    public ReleaseResponse createRelease(ReleaseRequest request) {
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
                .moderationState(ModerationState.ON_REVIEW)
                .releaseType(request.getReleaseType())
                .label(label)
                .build();

        Release saved = releaseRepository.save(release);
        return mapToResponse(saved);
    }

    public ReleaseResponse getRelease(Long id) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));
        return mapToResponse(release);
    }

    public List<ReleaseResponse> getReleasesByArtist(Long artistId) {
        return releaseRepository.findByArtistId(artistId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReleaseResponse> getReleasesByModerationState(ModerationState state) {
        return releaseRepository.findByModerationState(state).stream()
                .map(this::mapToResponse)
                .toList();
    }

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

    private Long generateUpc() {
        // Простая генерация для примера
        return System.currentTimeMillis() % 1000000000000L;
    }

    private ReleaseResponse mapToResponse(Release release) {
        ReleaseResponse response = new ReleaseResponse();
        response.setId(release.getId());
        response.setName(release.getName());
        response.setArtistId(release.getArtist().getId());
        response.setArtistName(release.getArtist().getName());
        response.setGenre(release.getGenre());
        response.setReleaseUpc(release.getReleaseUpc());
        response.setDate(release.getDate());
        response.setModerationState(release.getModerationState());
        response.setReleaseType(release.getReleaseType());
        response.setLabelId(release.getLabel().getId());
        response.setLabelName(release.getLabel().getContactName());
        return response;
    }

    public List<ReleaseResponse> getAllReleases() {
        return releaseRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

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
}