package com.crosspad.backend.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // 💡 혹시 모를 기본 생성자 에러 방지
@AllArgsConstructor // 💡 모든 필드를 인자로 받는 생성자 자동 생성 (id, 이메일, 닉네임, 권한 순서대로!)
public class LoginResponseDto {

    // 🌟 [오늘의 첫 단추] 리액트가 찜하기 기능을 때릴 때 식별자로 사용할 회원 고유 번호(PK)를 추가합니다.
    private Long id;

    private String email;
    private String nickname;
    private String role;
}