package com.crosspad.backend.domain.review;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByGameIdOrderByCreatedAtDesc(Long gameId);

    // 🌟 userId -> memberId로 교체 완료
    boolean existsByGameIdAndMemberId(Long gameId, Long memberId);
}