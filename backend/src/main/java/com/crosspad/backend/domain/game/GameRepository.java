package com.crosspad.backend.domain.game;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    boolean existsByIgdbGameId(Long igdbGameId);

    List<Game> findByPlatformOrderByRatingDesc(String platform);
    List<Game> findByTitleContainingIgnoreCase(String title);
}