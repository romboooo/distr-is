package org.example.distr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Artist\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"label", "releases", "user"})
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @Column(name = "\"name\"", nullable = false, length = 255)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"label_id\"", nullable = false)
    private Label label;

    @Column(name = "\"country\"", nullable = false, length = 100)
    private String country;

    @Column(name = "\"real_name\"", nullable = false, length = 255)
    private String realName;

    @OneToOne
    @JoinColumn(name = "\"user_id\"", nullable = false, unique = true)
    private User user;

    // Обратные связи
    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Release> releases = new ArrayList<>();
}