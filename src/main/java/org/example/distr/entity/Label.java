package org.example.distr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Label\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"artists", "releases", "royalties"})
public class Label {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @Column(name = "\"country\"", nullable = false, length = 100)
    private String country;

    @Column(name = "\"contact_name\"", nullable = false, length = 255)
    private String contactName;

    @Column(name = "\"phone\"", nullable = false, length = 50)
    private String phone;

    @OneToOne
    @JoinColumn(name = "\"user_id\"", nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = "label", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Artist> artists = new ArrayList<>();

    @OneToMany(mappedBy = "label", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Release> releases = new ArrayList<>();

    @OneToMany(mappedBy = "label", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Royalty> royalties = new ArrayList<>();
}