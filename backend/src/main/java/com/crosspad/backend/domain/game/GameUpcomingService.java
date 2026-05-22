package com.crosspad.backend.domain.game;

import com.crosspad.backend.domain.game.igdb.IgdbGameDto;
import com.crosspad.backend.domain.game.igdb.IgdbTokenService;
import com.crosspad.backend.domain.game.utils.DeepLTranslator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameUpcomingService {

    private final GameRepository gameRepository;
    private final IgdbTokenService igdbTokenService;
    private final DeepLTranslator deepLTranslator;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${twitch.client-id}")
    private String clientId;

    @Transactional
    public List<Game> getOrCreateUpcomingGames() {
        List<Game> totalUpcomingList = new ArrayList<>();

        // 1. 닌텐도 스위치 (IGDB ID: 130) 출시 예정작 수집 (최대 25개)
        totalUpcomingList.addAll(fetchUpcomingByPlatform(130L, "NINTENDO", 25));

        // 2. 플레이스테이션 5 (IGDB ID: 167) 출시 예정작 수집 (최대 25개)
        totalUpcomingList.addAll(fetchUpcomingByPlatform(167L, "PLAYSTATION", 25));

        return totalUpcomingList;
    }

    private List<Game> fetchUpcomingByPlatform(Long platformId, String platformName, int targetLimit) {
        String token = igdbTokenService.getAccessToken();
        if (token == null) return List.of();

        String url = "https://api.igdb.com/v4/games";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", clientId);
        headers.set("Authorization", "Bearer " + token);
        headers.set("Accept", "application/json");

        long currentUnixTime = Instant.now().getEpochSecond();

        String queryBody = "fields name, summary, cover.url, first_release_date, rating, videos.video_id, screenshots.url; " +
                "where platforms = " + platformId + " & first_release_date > " + currentUnixTime + " & cover.url != null; " +
                "sort first_release_date asc; " +
                "limit " + targetLimit + ";";

        HttpEntity<String> entity = new HttpEntity<>(queryBody, headers);
        List<Game> platformSavedGames = new ArrayList<>();

        try {
            ResponseEntity<List<IgdbGameDto>> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, new ParameterizedTypeReference<List<IgdbGameDto>>() {}
            );

            List<IgdbGameDto> dtoList = response.getBody();
            if (dtoList == null || dtoList.isEmpty()) return List.of();

            for (IgdbGameDto dto : dtoList) {
                // 🌟 [수정 완료] 이미 DB에 캐싱되어 있다면, 우리 DB에서 꺼내서 바구니에 담고 다음으로 넘어갑니다!
                if (gameRepository.existsByIgdbGameId(dto.getId())) {
                    // 예전에 저장해 둔 한글 세탁 완료된 게임 데이터를 조회
                    gameRepository.findByTitleContainingIgnoreCase(dto.getName()).stream()
                            .filter(g -> g.getIgdbGameId().equals(dto.getId()))
                            .findFirst()
                            .ifPresent(platformSavedGames::add);
                    continue;
                }

                String coverUrl = (dto.getCover() != null) ? "https:" + dto.getCover().getUrl() : null;

                String videoId = null;
                if (dto.getVideos() != null && !dto.getVideos().isEmpty()) {
                    videoId = dto.getVideos().get(0).getVideo_id();
                }

                List<String> screenshotUrls = new ArrayList<>();
                if (dto.getScreenshots() != null) {
                    for (IgdbGameDto.Screenshot scr : dto.getScreenshots()) {
                        if (scr.getUrl() != null) {
                            screenshotUrls.add("https:" + scr.getUrl());
                        }
                    }
                }

                String rawSummary = dto.getSummary();
                String translatedSummary;
                if (rawSummary == null || rawSummary.trim().isEmpty()) {
                    translatedSummary = "출시 예정작으로 아직 상세 줄거리 정보가 공개되지 않았습니다.";
                } else {
                    translatedSummary = deepLTranslator.translate(rawSummary);
                }

                Game game = Game.builder()
                        .igdbGameId(dto.getId())
                        .title(dto.getName())
                        .summary(translatedSummary)
                        .coverUrl(coverUrl)
                        .rating(dto.getRating() != null ? dto.getRating() : 0.0)
                        .platform(platformName)
                        .videoId(videoId)
                        .screenshots(screenshotUrls)
                        .build();

                gameRepository.save(game);
                platformSavedGames.add(game);
            }

        } catch (Exception e) {
            log.error("❌ [{}] 출시 예정작 캐싱 로직 구동 중 오류 발생: ", platformName, e);
        }

        return platformSavedGames;
    }
}