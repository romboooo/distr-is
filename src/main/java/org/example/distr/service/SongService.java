package org.example.distr.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.SongRequest;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.SongResponse;
import org.example.distr.entity.Artist;
import org.example.distr.entity.Release;
import org.example.distr.entity.Song;
import org.example.distr.exception.ResourceNotFoundException;
import org.example.distr.repository.ArtistRepository;
import org.example.distr.repository.ReleaseRepository;
import org.example.distr.repository.SongRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {
    private final SongRepository songRepository;
    private final ReleaseRepository releaseRepository;
    private final ArtistRepository artistRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public SongResponse createSong(SongRequest request) {
        Release release = releaseRepository.findById(request.getReleaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));

        JsonNode metadata = null;
        if (request.getMetadata() != null && !request.getMetadata().isEmpty()) {
            try {
                metadata = objectMapper.readTree(request.getMetadata());
            } catch (Exception e) {
                throw new RuntimeException("Invalid metadata JSON format");
            }
        }

        Song song = Song.builder()
                .release(release)
                .artistIds(request.getArtistIds())
                .musicAuthor(request.getMusicAuthor())
                .parentalAdvisory(request.getParentalAdvisory())
                .songUpc(request.getSongUpc())
                .metadata(metadata != null ? metadata : objectMapper.createObjectNode())
                .pathToFile(request.getPathToFile())
                .songLengthSeconds(request.getSongLengthSeconds())
                .build();

        Song saved = songRepository.save(song);
        return mapToResponse(saved);
    }

    public SongResponse getSong(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found"));
        return mapToResponse(song);
    }

    public List<SongResponse> getSongsByRelease(Long releaseId) {
        return songRepository.findByReleaseId(releaseId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SongResponse> getPopularSongs(Long minStreams) {
        return songRepository.findPopularSongs(minStreams).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public SongResponse updateStreams(Long id, Long additionalStreams) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found"));

        song.setStreams(song.getStreams() + additionalStreams);
        Song updated = songRepository.save(song);
        return mapToResponse(updated);
    }

    private SongResponse mapToResponse(Song song) {
        SongResponse response = new SongResponse();
        response.setId(song.getId());
        response.setReleaseId(song.getRelease().getId());
        response.setReleaseName(song.getRelease().getName());
        response.setArtistIds(song.getArtistIds());

        if (song.getArtistIds() != null) {
            List<String> artistNames = song.getArtistIds().stream()
                    .map(artistId -> artistRepository.findById(artistId)
                            .map(Artist::getName)
                            .orElse("Unknown Artist"))
                    .toList();
            response.setArtistNames(artistNames);
        }

        response.setMusicAuthor(song.getMusicAuthor());
        response.setParentalAdvisory(song.getParentalAdvisory());
        response.setStreams(song.getStreams());
        response.setSongUpc(song.getSongUpc());
        response.setMetadata(song.getMetadata() != null ? song.getMetadata().toString() : null);
        response.setPathToFile(song.getPathToFile());
        response.setSongLengthSeconds(song.getSongLengthSeconds());
        return response;
    }
    public List<SongResponse> getAllSongs() {
        return songRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PageResponse<SongResponse> getAllSongs(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Song> songPage = songRepository.findAll(pageable);

        List<SongResponse> content = songPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        PageResponse<SongResponse> response = new PageResponse<>();
        response.setContent(content);
        response.setCurrentPage(songPage.getNumber());
        response.setTotalPages(songPage.getTotalPages());
        response.setTotalElements(songPage.getTotalElements());
        response.setPageSize(songPage.getSize());

        return response;
    }
}