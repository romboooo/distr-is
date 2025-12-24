package org.example.distr.repository;

import org.example.distr.entity.RoyaltyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoyaltyReportRepository extends JpaRepository<RoyaltyReport, Long> {
    List<RoyaltyReport> findByReleaseId(Long releaseId);
    List<RoyaltyReport> findByPlatformId(Long platformId);

    @Query("SELECT rr FROM RoyaltyReport rr WHERE rr.release.releaseUpc = :upc")
    List<RoyaltyReport> findByReleaseUpc(@Param("upc") Long upc);
}