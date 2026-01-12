package org.example.distr.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.distr.dto.request.AddSongRequest;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.SongResponse;
import org.example.distr.entity.Artist;
import org.example.distr.entity.Release;
import org.example.distr.entity.Song;
import org.example.distr.exception.ResourceNotFoundException;
import org.example.distr.repository.ArtistRepository;
import org.example.distr.repository.ReleaseRepository;
import org.example.distr.repository.SongRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {
    private final SongRepository songRepository;
    private final ReleaseRepository releaseRepository;
    private final ArtistRepository artistRepository;
    private final UpcGeneratorService upcGeneratorService;
    private final ObjectMapper objectMapper;

    @Transactional
    public SongResponse addSongToRelease(Long releaseId, AddSongRequest request)
            throws JsonMappingException, JsonProcessingException {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found"));

        JsonNode metadata = (request.getMetadata() != null && !request.getMetadata().isEmpty())
                ? objectMapper.readTree(request.getMetadata())
                : objectMapper.createObjectNode();

        long songUpc = upcGeneratorService.generateUpc();

        Song song = Song.builder()
                .release(release)
                .artistIds(request.getArtistIds())
                .musicAuthor(request.getMusicAuthor())
                .parentalAdvisory(request.getParentalAdvisory())
                .songUpc(songUpc)
                .metadata(metadata)
                .pathToFile(null)
                .songLengthSeconds(null)
                .streams(0L)
                .build();

        Song savedSong = songRepository.save(song);
        return mapToResponse(savedSong);
    }

    @Transactional
    public void updateSongFile(Long songId, String filePath) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found"));

        if (song.getPathToFile() != null) {
            throw new IllegalStateException("Song file already exists. Use update endpoint instead.");
        }

        song.setPathToFile(filePath);
        songRepository.save(song);
    }

    private List<String> getArtistNames(List<Long> artistIds) {
        return artistIds.stream()
                .map(artistId -> artistRepository.findById(artistId)
                        .map(Artist::getName)
                        .orElse("Unknown Artist"))
                .collect(Collectors.toList());
    }

    private SongResponse mapToResponse(Song song) {
        List<String> artistNames = getArtistNames(song.getArtistIds());

        SongResponse response = new SongResponse();
        response.setId(song.getId());
        response.setReleaseId(song.getRelease().getId());
        response.setReleaseName(song.getRelease().getName());
        response.setArtistIds(song.getArtistIds());
        response.setArtistNames(artistNames);
        response.setMusicAuthor(song.getMusicAuthor());
        response.setParentalAdvisory(song.getParentalAdvisory());
        response.setStreams(song.getStreams());
        response.setSongUpc(song.getSongUpc());
        response.setMetadata(song.getMetadata() != null ? song.getMetadata().toString() : "{}");
        response.setPathToFile(song.getPathToFile());
        response.setSongLengthSeconds(song.getSongLengthSeconds());
        return response;
    }

    @Transactional(readOnly = true)
    public SongResponse getSong(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found"));
        return mapToResponse(song);
    }

    @Transactional(readOnly = true)
    public List<SongResponse> getSongsByRelease(Long releaseId) {
        List<Song> songs = songRepository.findByReleaseId(releaseId);
        return songs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<SongResponse> getAllSongs(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Song> songPage = songRepository.findAll(pageable);

        List<SongResponse> content = songPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        PageResponse<SongResponse> response = new PageResponse<SongResponse>();
        response.setContent(content);
        response.setCurrentPage(songPage.getNumber());
        response.setTotalPages(songPage.getTotalPages());
        response.setTotalElements(songPage.getTotalElements());
        response.setPageSize(songPage.getSize());

        return response;
    }
}
