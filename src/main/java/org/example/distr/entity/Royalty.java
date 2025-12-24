package org.example.distr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "\"Royalty\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"label", "song", "report", "platform"})
public class Royalty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"label_id\"", nullable = false)
    private Label label;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"song_id\"", nullable = false)
    private Song song;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"report_id\"", nullable = false)
    private RoyaltyReport report;

    @Column(name = "\"sum\"", nullable = false, precision = 15, scale = 2)
    private BigDecimal sum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"platform\"", nullable = false)
    private Platform platform;
}
