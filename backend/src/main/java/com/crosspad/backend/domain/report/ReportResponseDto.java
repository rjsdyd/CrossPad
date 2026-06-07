package com.crosspad.backend.domain.report; // 본인 패키지에 맞게 수정

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReportResponseDto {
    private Long id;
    private String reason;
    private String content;
    private String status;
    private LocalDateTime createdAt;

    // 프론트엔드에서 보여줄 상세 정보들
    private String reporterNickname;      // 신고자 닉네임
    private String reviewerNickname;      // 🌟 추가됨: 신고당한 리뷰 작성자 닉네임
    private String gameTitle;             // 신고된 게임 이름
    private String reportedReviewContent; // 신고당한 원본 리뷰 내용
}