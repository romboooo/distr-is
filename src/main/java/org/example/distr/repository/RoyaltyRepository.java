package org.example.distr.repository;

import org.example.distr.entity.Royalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RoyaltyRepository extends JpaRepository<Royalty, Long> {
    List<Royalty> findByLabelId(Long labelId);
    List<Royalty> findBySongId(Long songId);
    List<Royalty> findByReportId(Long reportId);

    @Query("SELECT SUM(r.sum) FROM Royalty r WHERE r.label.id = :labelId AND r.report.release.date BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalRoyaltiesForLabel(@Param("labelId") Long labelId,
                                               @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r FROM Royalty r WHERE r.song.release.artist.id = :artistId")
    List<Royalty> findRoyaltiesByArtistId(@Param("artistId") Long artistId);
}