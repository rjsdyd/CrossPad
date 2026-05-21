package com.crosspad.backend.domain.game;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    // 최근 검색어 역순(최신순)으로 정렬하여 조회
    List<SearchHistory> findAllByOrderBySearchedAtDesc();

    // 동일한 키워드가 있으면 중복 제거용 체크
    boolean existsByKeyword(String keyword);
    void deleteByKeyword(String keyword);
}