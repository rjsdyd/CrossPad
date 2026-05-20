package com.crosspad.backend.domain.admin;

import com.crosspad.backend.domain.member.Member;
import com.crosspad.backend.domain.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final MemberRepository memberRepository;

    private void validateAdminRole(String adminEmail) {
        Member member = memberRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 요청자입니다."));
        if (!"ROLE_ADMIN".equals(member.getRole())) {
            throw new IllegalArgumentException("관리자 권한이 없습니다.");
        }
    }

    @Transactional(readOnly = true)
    public List<Member> getAllMembers(String adminEmail) {
        validateAdminRole(adminEmail);
        return memberRepository.findAll();
    }

    @Transactional
    public void deleteMember(String adminEmail, Long targetMemberId) {
        validateAdminRole(adminEmail);
        memberRepository.deleteById(targetMemberId);
    }

    @Transactional
    public void promoteMember(String adminEmail, Long targetMemberId) {
        validateAdminRole(adminEmail);

        Member target = memberRepository.findById(targetMemberId)
                .orElseThrow(() -> new IllegalArgumentException("대상 유저를 찾을 수 없습니다."));

        target.promoteToAdmin();
    }
}
