package com.crosspad.backend.domain.game;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {

    private final GameRepository gameRepository;
    private final GameUpcomingService gameUpcomingService;
    private final GameService gameService;

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

    @GetMapping("/{id}")
    public ResponseEntity<?> getGameDetail(@PathVariable Long id) {
        try {
            // gameRepository에서 id로 찾고, 없으면 에러 던지기
            Game game = gameRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게임입니다."));
            return ResponseEntity.ok(game);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<Game>> getGameRanking() {
        // 1. 닌텐도 평점 탑 50 추출 (타입을 List<Game>으로 올바르게 수정)
        List<Game> nintendoTop50 = gameRepository.findTop50ByPlatformOrderByRatingDesc("NINTENDO");

        // 2. 플레이스테이션 평점 탑 50 추출 (언더바 오타 제거 및 타입 수정)
        List<Game> playstationTop50 = gameRepository.findTop50ByPlatformOrderByRatingDesc("PLAYSTATION");

        // 3. 두 기종의 데이터를 하나의 바구니(총 100개)로 통합
        List<Game> totalRankingList = new ArrayList<>();
        totalRankingList.addAll(nintendoTop50);
        totalRankingList.addAll(playstationTop50);

        // 4. 🔥 합쳐진 100개의 게임을 평점(Rating) 높은 순으로 다시 한번 정렬!
        totalRankingList.sort(Comparator.comparing(Game::getRating).reversed());

        return ResponseEntity.ok(totalRankingList);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Game>> getUpcomingGames() {
        List<Game> upcomingList = gameUpcomingService.getOrCreateUpcomingGames();
        return ResponseEntity.ok(upcomingList);
    }

    @GetMapping("/migrate-genres")
    public ResponseEntity<String> migrateGenres() {
        // gameService에 migrateEmptyGenres() 메서드가 추가되어 있어야 합니다!
        int resultCount = gameService.migrateEmptyGenres();
        return ResponseEntity.ok("성공적으로 " + resultCount + "개의 게임 데이터 장르 마이그레이션을 완료했습니다.");
    }
}