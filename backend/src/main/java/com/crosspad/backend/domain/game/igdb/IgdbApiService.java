package com.crosspad.backend.domain.game.igdb;

import com.crosspad.backend.domain.game.Game;
import com.crosspad.backend.domain.game.GameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IgdbApiService {

    private final IgdbTokenService igdbTokenService;
    private final GameRepository gameRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${twitch.client-id}")
    private String clientId;

    public void testFetchGames() {
        String token = igdbTokenService.getAccessToken();
        if (token == null) return;

        String url = "https://api.igdb.com/v4/games";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", clientId);
        headers.set("Authorization", "Bearer " + token);
        headers.set("Accept", "application/json");

        // 💡 닌텐도 스위치(130) 최고 명작 300개 쿼리문
        String nintendoBody = "fields name, summary, cover.url, rating, platforms, videos.video_id, screenshots.url; " +
                "where platforms = 130 & rating != null & cover.url != null; " +
                "sort rating desc; " +
                "limit 300;"; //

        // 💡 플레이스테이션 4 & 5(48, 167) 최고 명작 300개 쿼리문
        String playstationBody = "fields name, summary, cover.url, rating, platforms, videos.video_id, screenshots.url; " +
                "where platforms = (48, 167) & rating != null & cover.url != null; " +
                "sort rating desc; " +
                "limit 300;"; //

        // 🚀 1. 닌텐도 스위치 300개 독립 수집 시작
        log.info("... [IGDB 수집] 닌텐도 스위치 최고 명작 300개 캐싱을 시작합니다...");
        fetchAndSave(url, nintendoBody, headers, "NINTENDO");

        // 🚀 2. 플레이스테이션 300개 독립 수집 시작
        log.info("... [IGDB 수집] 플레이스테이션 최고 명작 300개 캐싱을 시작합니다...");
        fetchAndSave(url, playstationBody, headers, "PLAYSTATION");
    }

    // 💡 [공통 비즈니스 로직 수집기] 플랫폼별로 데이터를 받아와 가공한 뒤 번역기를 통과시킵니다.
    private void fetchAndSave(String url, String body, HttpHeaders headers, String currentPlatform) {
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<List<IgdbGameDto>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<List<IgdbGameDto>>() {}
            );

            List<IgdbGameDto> dtoList = response.getBody();
            if (dtoList == null) return;

            int savedCount = 0;
            for (IgdbGameDto dto : dtoList) {
                // 이미 DB에 존재하는 게임 ID라면 중복 수집 생략 패스
                if (gameRepository.existsByIgdbGameId(dto.getId())) {
                    continue;
                }

                String coverUrl = (dto.getCover() != null) ? "https:" + dto.getCover().getUrl() : null;

                // 1. 유튜브 비디오 ID 안전 추출
                String videoId = null;
                if (dto.getVideos() != null && !dto.getVideos().isEmpty()) {
                    videoId = dto.getVideos().get(0).getVideo_id();
                }

                // 2. 스크린샷 URL 리스트 안전 추출
                List<String> screenshotUrls = new ArrayList<>();
                if (dto.getScreenshots() != null) {
                    for (IgdbGameDto.Screenshot scr : dto.getScreenshots()) {
                        if (scr.getUrl() != null) {
                            screenshotUrls.add("https:" + scr.getUrl());
                        }
                    }
                }

                // 3. 엔티티 빌딩 및 가공된 한글 줄거리 주입
                Game game = Game.builder()
                        .igdbGameId(dto.getId())
                        .title(dto.getName()) // 타이틀 제목은 게이머 감성을 위해 영어 원문 유지
                        .coverUrl(coverUrl)
                        .rating(dto.getRating())
                        .platform(currentPlatform)
                        .videoId(videoId)
                        .screenshots(screenshotUrls)
                        .build();

                gameRepository.save(game);
                savedCount++;
            }

            log.info("🎯 [{}] 수집완료! 새롭게 밀어 넣은 명작 개수: {}개", currentPlatform, savedCount);

        } catch (Exception e) {
            log.error("❌ [{}] 데이터 파싱 및 캐싱 중 크리티컬 에러 발생: ", currentPlatform, e);
        }
    }
}