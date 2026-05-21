package com.crosspad.backend.domain.game;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 리액트 연동 허용
public class GameSearchController {

    private final GameSearchService gameSearchService;

    // 게임 타이틀 검색 API
    @GetMapping("/games")
    public ResponseEntity<List<Game>> searchGames(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(gameSearchService.searchGames(keyword));
    }

    // 최근 검색어 기록 조회 API
    @GetMapping("/history")
    public ResponseEntity<List<SearchHistory>> getHistory() {
        return ResponseEntity.ok(gameSearchService.getRecentSearches());
    }

    // 최근 검색어 개별 삭제 API
    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable("id") Long id) {
        gameSearchService.deleteHistory(id);
        return ResponseEntity.noContent().build();
    }
}