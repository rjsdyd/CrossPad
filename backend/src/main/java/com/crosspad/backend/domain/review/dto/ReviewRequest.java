package com.crosspad.backend.domain.review.dto;

import lombok.Getter;

@Getter
public class ReviewRequest {
    private Long gameId;
    private Long memberId;      // 🌟 userId -> memberId로 완전 교체
    private String nickname;    // 🌟 username -> nickname으로 교체
    private String content;
    private Double rating;
}