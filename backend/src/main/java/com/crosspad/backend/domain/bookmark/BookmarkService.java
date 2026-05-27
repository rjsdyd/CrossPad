package com.crosspad.backend.domain.bookmark;

import com.crosspad.backend.domain.game.Game;
import com.crosspad.backend.domain.game.GameRepository;
import com.crosspad.backend.domain.member.Member;
import com.crosspad.backend.domain.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final MemberRepository memberRepository;
    private final GameRepository gameRepository;

    @Transactional
    public boolean toggleBookmark(Long memberId, Long gameId) {
        // 1. 회원 정보 검증
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 👑 [권한 검증] 일반 유저만 허용, 관리자(ADMIN) 계정은 차단막 가동
        if ("ROLE_ADMIN".equals(member.getRole())) {
            throw new SecurityException("👑 관리자 계정은 북마크 기능을 이용할 수 없습니다.");
        }

        // 2. 게임 정보 검증
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게임입니다."));

        // 3. 이미 북마크 등록 상태인지 체크 후 토글 분기
        if (bookmarkRepository.existsByMemberIdAndGameId(memberId, gameId)) {
            bookmarkRepository.deleteByMemberIdAndGameId(memberId, gameId);
            return false; // 북마크 취소 완료 리턴
        } else {
            Bookmark bookmark = Bookmark.builder()
                    .member(member)
                    .game(game)
                    .build();
            bookmarkRepository.save(bookmark);
            return true; // 북마크 등록 완료 리턴
        }
    }

    @Transactional(readOnly = true)
    public boolean checkBookmarkStatus(Long memberId, Long gameId) {
        return bookmarkRepository.existsByMemberIdAndGameId(memberId, gameId);
    }

    @Transactional(readOnly = true)
    public List<Game> getMyBookmarkedGames(Long memberId) {
        return bookmarkRepository.findByMemberIdOrderByCreatedAtDesc(memberId).stream()
                .map(Bookmark::getGame)
                .collect(Collectors.toList());
    }
}