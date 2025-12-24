package org.example.distr.repository;

import org.example.distr.entity.Release;
import org.example.distr.entity.enums.ModerationState;
import org.example.distr.entity.enums.ReleaseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReleaseRepository extends JpaRepository<Release, Long> {
    List<Release> findByArtistId(Long artistId);
    List<Release> findByLabelId(Long labelId);
    List<Release> findByModerationState(ModerationState moderationState);
    Optional<Release> findByReleaseUpc(Long releaseUpc);
    List<Release> findByReleaseType(ReleaseType releaseType);

    @Query("SELECT r FROM Release r WHERE r.date BETWEEN :startDate AND :endDate")
    List<Release> findReleasesBetweenDates(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r FROM Release r WHERE r.artist.label.id = :labelId")
    List<Release> findReleasesByLabelId(@Param("labelId") Long labelId);
}