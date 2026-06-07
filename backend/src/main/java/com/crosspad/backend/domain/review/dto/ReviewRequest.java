package com.crosspad.backend.domain.review.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter // 🌟 추가: 프론트에서 온 데이터를 맵핑하기 위해 필수
@NoArgsConstructor // 🌟 추가: 스프링이 객체를 생성할 때 필수
public class ReviewRequest {
    private Long gameId;
    private Long memberId;      // 🌟 userId -> memberId로 완전 교체
    private String nickname;    // 🌟 username -> nickname으로 교체
    private String content;
    private Double rating;
}