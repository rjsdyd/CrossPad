package com.crosspad.backend.domain.review;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(
        name = "review",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_game_member",
                        columnNames = {"game_id", "member_id"} // 🌟 DB 컬럼명도 member_id로 고정
                )
        }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "game_id", nullable = false)
    private Long gameId;

    @Column(name = "member_id", nullable = false)
    private Long memberId; // 🌟 Member 체제 적용

    @Column(nullable = false)
    private String nickname; // 🌟 Member 체제 적용

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private Double rating;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder
    public Review(Long gameId, Long memberId, String nickname, String content, Double rating) {
        this.gameId = gameId;
        this.memberId = memberId;
        this.nickname = nickname;
        this.content = content;
        this.rating = rating;
    }

    public void updateReview(String content, Double rating) {
        this.content = content;
        this.rating = rating;
    }
}