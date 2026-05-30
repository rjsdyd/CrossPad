package com.crosspad.backend.domain.review;

import com.crosspad.backend.domain.review.dto.ReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        try {
            Review savedReview = reviewService.createReview(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<Review>> getReviewsByGame(@PathVariable Long gameId) {
        return ResponseEntity.ok(reviewService.getReviewsByGame(gameId));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @RequestParam Long memberId,
            @RequestBody ReviewRequest request) {
        try {
            Review updated = reviewService.updateReview(reviewId, memberId, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            @RequestParam Long memberId) {
        try {
            reviewService.deleteReview(reviewId, memberId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}   