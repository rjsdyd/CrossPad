package com.crosspad.backend.domain.member;

import com.crosspad.backend.domain.member.dto.LoginRequestDto;
import com.crosspad.backend.domain.member.dto.LoginResponseDto;
import com.crosspad.backend.domain.member.dto.SignupRequestDto; // 💡 임포트 복구
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager em;

    // 🌟 [복구] 유실되었던 회원가입 비즈니스 로직
    @Transactional
    public String signup(SignupRequestDto requestDto) {
        // 1. 이메일 중복 검사
        if (memberRepository.existsByEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 2. 닉네임 중복 검사
        if (memberRepository.existsByNickname(requestDto.getNickname())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        // 3. 패스워드 암호화 및 유저 엔티티 생성
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());
        Member member = new Member(
                requestDto.getEmail(),
                encodedPassword,
                requestDto.getNickname(),
                "ROLE_USER" // 기본 회원 등급은 일반 유저로 설정
        );

        // 4. DB에 저장
        memberRepository.save(member);
        return "회원가입이 완료되었습니다.";
    }

    // 🔐 로그인 비즈니스 로직 (수정본 유지)
    @Transactional
    public LoginResponseDto login(LoginRequestDto requestDto) {
        // DB 캐시를 강제로 비워 실시간 권한 반영 보장
        em.clear();

        Member member = memberRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(requestDto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        System.out.println("🚨 현재 로그인 시도 유저의 DB 권한: " + member.getRole());

        return new LoginResponseDto(member.getId(), member.getEmail(), member.getNickname(), member.getRole());
    }
}