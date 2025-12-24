package org.example.distr.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Song\"")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"release", "royalties"})
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"release_id\"", nullable = false)
    private Release release;

    @Type(JsonType.class)
    @Column(name = "\"artist_id\"", columnDefinition = "jsonb")
    private List<Long> artistIds; // JSON массив ID артистов

    @Column(name = "\"music_author\"", nullable = false, length = 255)
    private String musicAuthor;

    @Column(name = "\"parental_advisory\"", nullable = false)
    private Boolean parentalAdvisory;

    @Column(name = "\"streams\"", nullable = false)
    private Long streams = 0L;

    @Column(name = "\"song_upc\"", nullable = false, unique = true)
    private Long songUpc;

    @Type(JsonType.class)
    @Column(name = "\"metadata\"", columnDefinition = "jsonb")
    private JsonNode metadata; // Дополнительные метаданные в JSON

    @Column(name = "\"path_to_file\"", nullable = false, length = 500)
    private String pathToFile;

    @Column(name = "\"song_length_seconds\"", nullable = false)
    private Integer songLengthSeconds;

    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Royalty> royalties = new ArrayList<>();
}