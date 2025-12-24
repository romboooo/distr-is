package org.example.distr.entity;

import org.example.distr.entity.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Release\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"artist", "label", "songs", "moderationRecords", "royaltyReports"})
public class Release {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @Column(name = "\"name\"", nullable = false, length = 255)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"artist_id\"", nullable = false)
    private Artist artist;

    @Column(name = "\"genre\"", nullable = false, length = 100)
    private String genre;

    @Column(name = "\"release_upc\"", nullable = false, unique = true)
    private Long releaseUpc;

    @CreationTimestamp
    @Column(name = "\"date\"", nullable = false)
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"moderation_state\"", nullable = false, length = 50)
    private ModerationState moderationState;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"release_type\"", nullable = false, length = 50)
    private ReleaseType releaseType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"label_id\"", nullable = false)
    private Label label;

    // Обратные связи
    @OneToMany(mappedBy = "release", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Song> songs = new ArrayList<>();

    @OneToMany(mappedBy = "release", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OnModeration> moderationRecords = new ArrayList<>();

    @OneToMany(mappedBy = "release", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RoyaltyReport> royaltyReports = new ArrayList<>();
}