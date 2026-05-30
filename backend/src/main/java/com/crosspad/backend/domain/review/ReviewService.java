package com.crosspad.backend.domain.review;

import com.crosspad.backend.domain.review.dto.ReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Transactional
    public Review createReview(ReviewRequest request) {
        // 🌟 1인 1리뷰 체크 (Member 기준)
        if (reviewRepository.existsByGameIdAndMemberId(request.getGameId(), request.getMemberId())) {
            throw new IllegalArgumentException("이미 이 게임에 한 줄 평을 남기셨습니다.");
        }

        // 🌟 백엔드 단에서 강력한 널(Null) 방어막 추가! (프론트에서 이름 안 보내도 절대 안 터짐)
        String safeNickname = (request.getNickname() == null || request.getNickname().trim().isEmpty())
                ? "익명멤버" : request.getNickname();

        Review review = Review.builder()
                .gameId(request.getGameId())
                .memberId(request.getMemberId())
                .nickname(safeNickname)
                .content(request.getContent())
                .rating(request.getRating())
                .build();

        return reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByGame(Long gameId) {
        return reviewRepository.findByGameIdOrderByCreatedAtDesc(gameId);
    }

    @Transactional
    public Review updateReview(Long reviewId, Long memberId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        if (!review.getMemberId().equals(memberId)) {
            throw new IllegalStateException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        }

        review.updateReview(request.getContent(), request.getRating());
        return review;
    }

    @Transactional
    public void deleteReview(Long reviewId, Long memberId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다."));

        if (!review.getMemberId().equals(memberId)) {
            throw new IllegalStateException("본인이 작성한 리뷰만 삭제할 수 있습니다.");
        }

        reviewRepository.delete(review);
    }
}