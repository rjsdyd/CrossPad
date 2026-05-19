package com.crosspad.backend.domain.game;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {

    private final GameRepository gameRepository;

    /**
         * 게임 목록 조회 API
         * URL 예시:
         * 1) 전체 조회: http://localhost:8080/api/games
         * 2) 닌텐도 필터: http://localhost:8080/api/games?platform=NINTENDO
         * 3) 플스 필터: http://localhost:8080/api/games?platform=PLAYSTATION
     */
    @GetMapping
    public List<Game> getGames(@RequestParam(required = false) String platform) {
        if (platform != null && !platform.isEmpty()) {
            return gameRepository.findByPlatformOrderByRatingDesc(platform.toUpperCase());
        }

        return gameRepository.findAll();
    }
}