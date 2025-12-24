package org.example.distr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Platform\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"royaltyReports", "royalties"})
public class Platform {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @Column(name = "\"name\"", nullable = false, unique = true, length = 100)
    private String name;

    // Обратные связи
    @OneToMany(mappedBy = "platform", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RoyaltyReport> royaltyReports = new ArrayList<>();

    @OneToMany(mappedBy = "platform", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Royalty> royalties = new ArrayList<>();
}
