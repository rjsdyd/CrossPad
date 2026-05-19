package com.crosspad.backend.domain.member;

import com.crosspad.backend.domain.member.dto.SignupRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequestDto requestDto) {
        String resultMessage = memberService.signup(requestDto);
        return ResponseEntity.ok(resultMessage);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody com.crosspad.backend.domain.member.dto.LoginRequestDto requestDto) {
        try {
            com.crosspad.backend.domain.member.dto.LoginResponseDto responseDto = memberService.login(requestDto);
            return ResponseEntity.ok(responseDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
