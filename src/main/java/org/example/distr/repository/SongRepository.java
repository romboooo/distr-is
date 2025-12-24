package org.example.distr.repository;

import org.example.distr.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByReleaseId(Long releaseId);
    Optional<Song> findBySongUpc(Long songUpc);

    @Query("SELECT s FROM Song s WHERE s.streams > :minStreams")
    List<Song> findPopularSongs(@Param("minStreams") Long minStreams);

    @Query("SELECT s FROM Song s WHERE s.parentalAdvisory = true")
    List<Song> findExplicitSongs();
}