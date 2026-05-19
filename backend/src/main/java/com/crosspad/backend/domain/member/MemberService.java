package com.crosspad.backend.domain.member;

import com.crosspad.backend.domain.member.dto.SignupRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String signup(SignupRequestDto requestDto) {
        if (memberRepository.existsByEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (memberRepository.existsByNickname(requestDto.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        Member newMember = Member.builder()
                .email(requestDto.getEmail())
                .password(encodedPassword) // 💡 날것의 비밀번호 대신 암호화된 비밀번호 삽입!
                .nickname(requestDto.getNickname())
                .role("ROLE_USER") // 기본 권한 부여
                .build();

        memberRepository.save(newMember);

        return "크로스패드 회원가입 대성공!";
    }
    @Transactional(readOnly = true)
    public com.crosspad.backend.domain.member.dto.LoginResponseDto login(com.crosspad.backend.domain.member.dto.LoginRequestDto requestDto) {
        // 1. 이메일 존재 여부 확인
        Member member = memberRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        // 2. 비밀번호 일치 여부 확인 (암호화된 비밀번호 비교)
        if (!passwordEncoder.matches(requestDto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공 시 유저 정보 반환
        return new com.crosspad.backend.domain.member.dto.LoginResponseDto(member.getEmail(), member.getNickname());
    }
}