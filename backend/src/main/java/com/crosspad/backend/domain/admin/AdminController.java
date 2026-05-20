package com.crosspad.backend.domain.admin;

import lombok.RequiredArgsConstructor;
import com.crosspad.backend.domain.member.Member;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/members")
    public ResponseEntity<?> getAllMembers(@RequestParam String email) {
        try {
            List<Member> members = adminService.getAllMembers(email);
            return ResponseEntity.ok(members);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/members/{targetId}")
    public ResponseEntity<?> deleteMember(@PathVariable Long targetId, @RequestParam String email) {
        try {
            adminService.deleteMember(email, targetId);
            return ResponseEntity.ok("유저가 성공적으로 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PostMapping("/members/{targetId}/promote")
    public ResponseEntity<?> promoteMember(@PathVariable Long targetId, @RequestParam String email) {
        try {
            adminService.promoteMember(email, targetId);
            return ResponseEntity.ok("해당 유저가 관리자로 승급되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
