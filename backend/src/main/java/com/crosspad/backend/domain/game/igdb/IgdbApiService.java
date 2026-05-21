package com.crosspad.backend.domain.game.igdb;

import com.crosspad.backend.domain.game.Game;
import com.crosspad.backend.domain.game.GameRepository;
import com.crosspad.backend.domain.game.utils.DeepLTranslator; // 💡 임포트 확인
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
@RequiredArgsConstructor // 💡 생성자 주입 자동 완성
public class IgdbApiService {

    private final IgdbTokenService igdbTokenService; //
    private final GameRepository gameRepository; //
    private final DeepLTranslator deepLTranslator; // 🌟 [스태틱 버그 해결의 치트키] 정상적인 스프링 빈 주입!
    private final RestTemplate restTemplate = new RestTemplate(); //

    @Value("${twitch.client-id}")
    private String clientId; //

    public void testFetchGames() {
        String token = igdbTokenService.getAccessToken(); //
        if (token == null) return; //

        String url = "https://api.igdb.com/v4/games"; //

        HttpHeaders headers = new HttpHeaders(); //
        headers.set("Client-ID", clientId); //
        headers.set("Authorization", "Bearer " + token); //
        headers.set("Accept", "application/json"); //

        String nintendoBody = "fields name, summary, cover.url, rating, platforms, videos.video_id, screenshots.url; " +
                "where platforms = 130 & rating != null & cover.url != null; " +
                "sort rating desc; " +
                "limit 300;"; //

        String playstationBody = "fields name, summary, cover.url, rating, platforms, videos.video_id, screenshots.url; " +
                "where platforms = (48, 167) & rating != null & cover.url != null; " +
                "sort rating desc; " +
                "limit 300;"; //

        log.info("... [IGDB 수집] 닌텐도 스위치 최고 명작 300개 캐싱을 시작합니다..."); //
        fetchAndSave(url, nintendoBody, headers, "NINTENDO"); //

        log.info("... [IGDB 수집] 플레이스테이션 최고 명작 300개 캐싱을 시작합니다..."); //
        fetchAndSave(url, playstationBody, headers, "PLAYSTATION"); //
    }

    private void fetchAndSave(String url, String body, HttpHeaders headers, String currentPlatform) {
        HttpEntity<String> entity = new HttpEntity<>(body, headers); //

        try {
            ResponseEntity<List<IgdbGameDto>> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, new ParameterizedTypeReference<List<IgdbGameDto>>() {}
            ); //

            List<IgdbGameDto> dtoList = response.getBody(); //
            if (dtoList == null) return; //

            int savedCount = 0; //
            for (IgdbGameDto dto : dtoList) {
                if (gameRepository.existsByIgdbGameId(dto.getId())) { //
                    continue; //
                }

                String coverUrl = (dto.getCover() != null) ? "https:" + dto.getCover().getUrl() : null; //

                String videoId = null; //
                if (dto.getVideos() != null && !dto.getVideos().isEmpty()) { //
                    videoId = dto.getVideos().get(0).getVideo_id(); //
                }

                List<String> screenshotUrls = new ArrayList<>(); //
                if (dto.getScreenshots() != null) { //
                    for (IgdbGameDto.Screenshot scr : dto.getScreenshots()) { //
                        if (scr.getUrl() != null) { //
                            screenshotUrls.add("https:" + scr.getUrl()); //
                        }
                    }
                }

                String rawSummary = dto.getSummary();
                if (rawSummary == null || rawSummary.trim().isEmpty()) {
                    rawSummary = "상세 줄거리 정보가 제공되지 않는 게임입니다.";
                }

                // 🌟 [수정완료] static 대신 주입받은 deepLTranslator 객체의 일반 메서드를 호출합니다!
                String translatedSummary = deepLTranslator.translate(rawSummary);

                if (translatedSummary.contains("⚠️ DeepL API Key가 설정되지 않았습니다") ||
                        translatedSummary.contains("❌ DeepL API 서버 에러")) {
                    translatedSummary = rawSummary;
                }

                Game game = Game.builder()
                        .igdbGameId(dto.getId()) //
                        .title(dto.getName()) //
                        .summary(translatedSummary) // 완벽하게 세탁된 한글 줄거리 주입
                        .coverUrl(coverUrl) //
                        .rating(dto.getRating()) //
                        .platform(currentPlatform) //
                        .videoId(videoId) //
                        .screenshots(screenshotUrls) //
                        .build(); //

                gameRepository.save(game); //
                savedCount++; //
            }

            log.info("🎯 [{}] 수집완료! 새롭게 밀어 넣은 명작 개수: {}개", currentPlatform, savedCount); //

        } catch (Exception e) {
            log.error("❌ [{}] 데이터 파싱 및 캐싱 중 크리티컬 에러 발생: ", currentPlatform, e); //
        }
    }
}