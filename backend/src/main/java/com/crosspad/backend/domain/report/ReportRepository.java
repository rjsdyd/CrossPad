package com.crosspad.backend.domain.report; // 본인의 패키지 경로에 맞게 수정하세요

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
}