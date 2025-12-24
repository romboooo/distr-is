package org.example.distr.repository;

import org.example.distr.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByLabelId(Long labelId);
    List<Artist> findByNameContainingIgnoreCase(String name);
}