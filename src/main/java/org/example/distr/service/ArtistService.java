package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.ArtistRequest;
import org.example.distr.dto.response.ArtistResponse;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.entity.Artist;
import org.example.distr.entity.Label;
import org.example.distr.entity.User;
import org.example.distr.exception.ResourceNotFoundException;
import org.example.distr.repository.ArtistRepository;
import org.example.distr.repository.LabelRepository;
import org.example.distr.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final LabelRepository labelRepository;
    private final UserRepository userRepository;

    @Transactional
    public ArtistResponse createArtist(ArtistRequest request) {
        Label label = labelRepository.findById(request.getLabelId())
                .orElseThrow(() -> new ResourceNotFoundException("Label not found with id: " + request.getLabelId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Artist artist = Artist.builder()
                .name(request.getName())
                .label(label)
                .country(request.getCountry())
                .realName(request.getRealName())
                .user(user)
                .build();

        Artist saved = artistRepository.save(artist);
        return mapToResponse(saved);
    }

    public ArtistResponse getArtist(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + id));
        return mapToResponse(artist);
    }

    public List<ArtistResponse> getArtistsByLabel(Long labelId) {
        return artistRepository.findByLabelId(labelId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ArtistResponse> getArtistsByCountry(String country) {
        return artistRepository.findByCountry(country).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ArtistResponse updateArtist(Long id, ArtistRequest request) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));

        Label label = labelRepository.findById(request.getLabelId())
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        artist.setName(request.getName());
        artist.setLabel(label);
        artist.setCountry(request.getCountry());
        artist.setRealName(request.getRealName());
        artist.setUser(user);

        Artist updated = artistRepository.save(artist);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteArtist(Long id) {
        if (!artistRepository.existsById(id)) {
            throw new ResourceNotFoundException("Artist not found with id: " + id);
        }
        artistRepository.deleteById(id);
    }

    private ArtistResponse mapToResponse(Artist artist) {
        ArtistResponse response = new ArtistResponse();
        response.setId(artist.getId());
        response.setName(artist.getName());
        response.setLabelId(artist.getLabel().getId());
        response.setLabelName(artist.getLabel().getContactName());
        response.setCountry(artist.getCountry());
        response.setRealName(artist.getRealName());
        response.setUserId(artist.getUser().getId());
        response.setUserLogin(artist.getUser().getLogin());
        return response;
    }

    public PageResponse<ArtistResponse> getAllArtists(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Artist> artistPage = artistRepository.findAll(pageable);

        List<ArtistResponse> content = artistPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        PageResponse<ArtistResponse> response = new PageResponse<>();
        response.setContent(content);
        response.setCurrentPage(artistPage.getNumber());
        response.setTotalPages(artistPage.getTotalPages());
        response.setTotalElements(artistPage.getTotalElements());
        response.setPageSize(artistPage.getSize());

        return response;
    }

    public ArtistResponse getArtistByUserId(Long userId) {
        Artist artist = artistRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Artist not found for user ID: " + userId));

        return mapToResponse(artist);
    }

    public PageResponse<ArtistResponse> getArtistsByLabel(Long labelId, int pageNumber, int pageSize) {
        if (!labelRepository.existsById(labelId)) {
            throw new ResourceNotFoundException("Label not found with id: " + labelId);
        }

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Artist> artistPage = artistRepository.findByLabelId(labelId, pageable);

        List<ArtistResponse> content = artistPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        PageResponse<ArtistResponse> response = new PageResponse<>();
        response.setContent(content);
        response.setCurrentPage(artistPage.getNumber());
        response.setTotalPages(artistPage.getTotalPages());
        response.setTotalElements(artistPage.getTotalElements());
        response.setPageSize(artistPage.getSize());

        return response;
    }
}
