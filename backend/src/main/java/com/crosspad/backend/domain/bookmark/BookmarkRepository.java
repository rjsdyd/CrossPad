package com.crosspad.backend.domain.bookmark;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    // 🌟 특정 게임에 이 회원이 이미 북마크를 눌렀는지 확인
    boolean existsByMemberIdAndGameId(Long memberId, Long gameId);

    // 🌟 북마크 토글 취소(삭제)를 위한 쿼리
    void deleteByMemberIdAndGameId(Long memberId, Long gameId);

    // 🌟 마이페이지 등에서 쓸 수 있는 최근 북마크 순 정렬 쿼리
    List<Bookmark> findByMemberIdOrderByCreatedAtDesc(Long memberId);
}