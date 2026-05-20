package com.crosspad.backend.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // 💡 혹시 모를 기본 생성자 에러 방지
@AllArgsConstructor // 💡 모든 필드를 인자로 받는 생성자 자동 생성 (이메일, 닉네임, 권한 순서대로!)
public class LoginResponseDto {
    private String email;
    private String nickname;
    private String role; // 👈 3번째 자리에 확실하게 추가되어 있는지 확인!
}