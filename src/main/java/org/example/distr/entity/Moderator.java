package org.example.distr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "moderators")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "moderationRecords"})
public class Moderator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @Column(name = "\"name\"", nullable = false, length = 255)
    private String name;

    @OneToOne
    @JoinColumn(name = "\"user_id\"", nullable = false, unique = true)
    private User user;

    @Builder.Default
    @OneToMany(mappedBy = "moderator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OnModeration> moderationRecords = new ArrayList<>();
}