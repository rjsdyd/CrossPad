package com.crosspad.backend.domain.bookmark;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.crosspad.backend.domain.game.Game;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 🌐 CORS 차단 에러 방지막
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleBookmark(@RequestBody BookmarkRequest dto) {
        try {
            boolean isBookmarked = bookmarkService.toggleBookmark(dto.getMemberId(), dto.getGameId());
            if (isBookmarked) {
                return ResponseEntity.ok("❤️ 게임을 북마크에 등록했습니다.");
            } else {
                return ResponseEntity.ok("💔 북마크를 취소했습니다.");
            }
        } catch (SecurityException e) {
            // 관리자 권한 거부 시 403 Forbidden 상태 코드 전송
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            // 식별자 에러 등 발생 시 400 Bad Request 상태 코드 전송
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 🌟 상세페이지 로딩 시 프론트엔드가 요청하는 북마크 초기 상태 확인 API
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkBookmark(@RequestParam Long memberId, @RequestParam Long gameId) {
        boolean isBookmarked = bookmarkService.checkBookmarkStatus(memberId, gameId);
        return ResponseEntity.ok(isBookmarked);
    }

    // 🌟 마이페이지에서 호출하는 유저별 북마크 게임 목록 조회 API
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Game>> getMyBookmarkedGames(@PathVariable Long memberId) {
        List<Game> bookmarkedGames = bookmarkService.getMyBookmarkedGames(memberId);
        return ResponseEntity.ok(bookmarkedGames);
    }

    // 통신 규격용 내부 DTO
    @Data
    public static class BookmarkRequest {
        private Long memberId;
        private Long gameId;
    }
}