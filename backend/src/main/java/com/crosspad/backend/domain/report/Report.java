package com.crosspad.backend.domain.report; // 본인의 패키지 경로에 맞게 수정하세요

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long reporterId; // 신고한 사람의 ID (Member ID)

    @Column(nullable = false)
    private Long reviewId; // 신고당한 리뷰의 ID

    @Column(nullable = false)
    private String reason; // 신고 사유 (예: 욕설, 스팸 등)

    @Column(length = 500)
    private String content; // 상세 신고 내용

    @Column(nullable = false)
    private String status = "PENDING"; // 처리 상태 (PENDING: 처리 전, RESOLVED: 처리 완료)

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}