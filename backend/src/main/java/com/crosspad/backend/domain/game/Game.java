package com.crosspad.backend.domain.game;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long igdbGameId;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String coverUrl;
    private Double rating;
    private String platform;

    // 💡 [추가] 유튜브 트레일러 비디오 ID 컬럼
    private String videoId;

    // 💡 [추가] 스크린샷 URL 목록 저장용 1:N 매핑 테이블 설정
    @ElementCollection
    @CollectionTable(name = "game_screenshots", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "screenshot_url")
    @Builder.Default // 빌더 패턴 사용 시 기본값(ArrayList) 유지 설정
    private List<String> screenshots = new ArrayList<>();
}