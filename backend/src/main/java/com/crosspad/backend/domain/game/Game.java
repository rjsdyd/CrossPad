package com.crosspad.backend.domain.game;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "game")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "igdb_game_id", nullable = false, unique = true)
    private Long igdbGameId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 50)
    private String platform;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "cover_url", length = 512)
    private String coverUrl;

    private Double rating;
}