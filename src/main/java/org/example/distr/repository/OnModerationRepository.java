package org.example.distr.repository;

import org.example.distr.entity.OnModeration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OnModerationRepository extends JpaRepository<OnModeration, Long> {
    List<OnModeration> findByReleaseId(Long releaseId);
    List<OnModeration> findByModeratorId(Long moderatorId);

    @Query("SELECT om FROM OnModeration om WHERE om.date BETWEEN :startDate AND :endDate")
    List<OnModeration> findModerationRecordsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                                         @Param("endDate") LocalDateTime endDate);
}