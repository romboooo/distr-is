// src/main/java/org/example/distr/repository/ArtistRepository.java
package org.example.distr.repository;

import org.example.distr.entity.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByLabelId(Long labelId);

    Page<Artist> findByLabelId(Long labelId, Pageable pageable);

    @Query("SELECT a FROM Artist a WHERE LOWER(a.country) = LOWER(:country)")
    List<Artist> findByCountry(@Param("country") String country);

    Optional<Artist> findByUserId(Long userId);
}
