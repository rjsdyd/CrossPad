package com.crosspad.backend.domain.report;

import com.crosspad.backend.domain.member.MemberRepository;
import com.crosspad.backend.domain.review.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping
    public ResponseEntity<String> createReport(@RequestBody Report report) {
        reportRepository.save(report);
        return ResponseEntity.ok("신고가 성공적으로 접수되었습니다.");
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        List<ReportResponseDto> dtoList = new ArrayList<>();

        for (Report report : reports) {
            ReportResponseDto dto = new ReportResponseDto();
            dto.setId(report.getId());
            dto.setReason(report.getReason());
            dto.setContent(report.getContent());
            dto.setStatus(report.getStatus());
            dto.setCreatedAt(report.getCreatedAt());

            // 1. 신고자 닉네임 찾기
            memberRepository.findById(report.getReporterId())
                    .ifPresent(member -> dto.setReporterNickname(member.getNickname()));

            // 2. 신고당한 리뷰 정보 및 리뷰 작성자 닉네임 찾기
            reviewRepository.findById(report.getReviewId())
                    .ifPresent(review -> {
                        dto.setReportedReviewContent(review.getContent());

                        // 리뷰 작성자 닉네임 찾기
                        memberRepository.findById(review.getMemberId())
                                .ifPresent(reviewer -> dto.setReviewerNickname(reviewer.getNickname()));

                        // 게임 타이틀 세팅
                        dto.setGameTitle(review.getGameId() + "번 게임");
                    });

            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }
}