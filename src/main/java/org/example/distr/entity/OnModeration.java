package org.example.distr.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "on_moderation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"moderator", "release"})
public class OnModeration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @Column(name = "\"comment\"", nullable = false, columnDefinition = "TEXT")
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"moderator_id\"", nullable = false)
    private Moderator moderator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"release_id\"", nullable = false)
    private Release release;

    @CreationTimestamp
    @Column(name = "\"date\"", nullable = false)
    private LocalDateTime date;
}