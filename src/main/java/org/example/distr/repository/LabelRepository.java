package org.example.distr.repository;

import org.example.distr.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {
    Optional<Label> findByUserId(Long userId);
    List<Label> findByCountry(String country);
}