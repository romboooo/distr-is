package org.example.distr.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Royalty_report\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"release", "platform", "royalties"})
public class RoyaltyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"upc\"", referencedColumnName = "\"release_upc\"", nullable = false)
    private Release release;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"platform_id\"", nullable = false)
    private Platform platform;

    // Обратные связи
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Royalty> royalties = new ArrayList<>();
}