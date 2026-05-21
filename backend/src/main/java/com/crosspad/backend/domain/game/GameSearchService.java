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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameSearchService {

    private final GameRepository gameRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final IgdbTokenService igdbTokenService;
    private final DeepLTranslator deepLTranslator;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${twitch.client-id}")
    private String clientId;

    /**
     * 게임 타이틀 통합 검색 (로컬 DB 우선 조회 -> 없으면 실시간 외부 수집)
     */
    @Transactional
    public List<Game> searchGames(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }

        String trimmedKeyword = keyword.trim();

        // 1. 검색 히스토리 저장 및 최신화
        if (searchHistoryRepository.existsByKeyword(trimmedKeyword)) {
            searchHistoryRepository.deleteByKeyword(trimmedKeyword);
        }
        searchHistoryRepository.save(SearchHistory.builder()
                .keyword(trimmedKeyword)
                .searchedAt(LocalDateTime.now())
                .build());

        // 2. 1차 시도: 로컬 MariaDB 내부에서 대소문자 구분 없이 LIKE 검색
        List<Game> localResults = gameRepository.findByTitleContainingIgnoreCase(trimmedKeyword);

        // 3. 캐싱 방어막: 로컬 결과가 존재하면 실시간 외부 API를 호출하지 않고 즉시 반환 (DeepL 한도 보존)
        if (!localResults.isEmpty()) {
            return localResults;
        }

        // 4. 2차 시도: 로컬 DB에 없을 때만 실시간 외부 IGDB 타격 및 자동 기종 매핑 수집
        log.info("🔍 [실시간 외부 검색] DB에 '{}' 결과가 없음. IGDB 실시간 수집 및 기종 판별기 가동!", trimmedKeyword);
        return fetchFromIgdbRealTime(trimmedKeyword);
    }

    /**
     * IGDB 실시간 수집 및 지능형 기종 자동 분류 알고리즘
     */
    private List<Game> fetchFromIgdbRealTime(String keyword) {
        String token = igdbTokenService.getAccessToken();
        if (token == null) return List.of();

        String url = "https://api.igdb.com/v4/games";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", clientId);
        headers.set("Authorization", "Bearer " + token);
        headers.set("Accept", "application/json");

        // platforms 배열 데이터를 추가로 땡겨오도록 fields 쿼리문 고도화
        String queryBody = "fields name, summary, cover.url, rating, platforms, videos.video_id, screenshots.url; " +
                "where name ~ *\"" + keyword + "\"* & rating != null & cover.url != null; " +
                "sort rating desc; " +
                "limit 10;";

        HttpEntity<String> entity = new HttpEntity<>(queryBody, headers);
        List<Game> savedList = new ArrayList<>();

        try {
            ResponseEntity<List<IgdbGameDto>> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, new ParameterizedTypeReference<List<IgdbGameDto>>() {}
            );

            List<IgdbGameDto> dtoList = response.getBody();
            if (dtoList == null || dtoList.isEmpty()) return List.of();

            for (IgdbGameDto dto : dtoList) {
                // 중복 저장 방지 필터링
                if (gameRepository.existsByIgdbGameId(dto.getId())) {
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
                if (rawSummary == null || rawSummary.trim().isEmpty()) {
                    rawSummary = "상세 줄거리 정보가 제공되지 않는 게임입니다.";
                }

                // DeepL 실시간 한글 번역 가동
                String translatedSummary = deepLTranslator.translate(rawSummary);

                // 🌟 [지능형 자동 기종 분류 판별]
                String calculatedPlatform = "MULTIPLAT"; // 기본 초기값

                if (dto.getPlatforms() != null) {
                    // 130 = Nintendo Switch 코드가 포함되어 있다면 NINTENDO로 분류
                    if (dto.getPlatforms().contains(130L)) {
                        calculatedPlatform = "NINTENDO";
                    }
                    // 48 = PS4, 167 = PS5 코드가 포함되어 있다면 PLAYSTATION으로 분류
                    else if (dto.getPlatforms().contains(48L) || dto.getPlatforms().contains(167L)) {
                        calculatedPlatform = "PLAYSTATION";
                    }
                }

                Game game = Game.builder()
                        .igdbGameId(dto.getId())
                        .title(dto.getName())
                        .summary(translatedSummary)
                        .coverUrl(coverUrl)
                        .rating(dto.getRating())
                        .platform(calculatedPlatform) // 🌟 동적 매핑된 플랫폼 문자열 주입!
                        .videoId(videoId)
                        .screenshots(screenshotUrls)
                        .build();

                // DB에 영구 적재 조치 (다음 검색 시 방어막으로 자동 작동)
                gameRepository.save(game);
                savedList.add(game);
            }

        } catch (Exception e) {
            log.error("❌ 실시간 외부 검색 및 기종 매핑 중 에러 발생: ", e);
        }

        return savedList;
    }

    /**
     * 최근 검색어 목록 역순(최신순) 조회
     */
    @Transactional(readOnly = true)
    public List<SearchHistory> getRecentSearches() {
        return searchHistoryRepository.findAllByOrderBySearchedAtDesc();
    }

    /**
     * 최근 검색어 단건 삭제
     */
    @Transactional
    public void deleteHistory(Long id) {
        searchHistoryRepository.deleteById(id);
    }
}