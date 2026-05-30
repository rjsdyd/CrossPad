package com.crosspad.backend.domain.game;

import com.crosspad.backend.domain.game.igdb.IgdbGameDto;
import com.crosspad.backend.domain.game.igdb.IgdbTokenService;
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

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final IgdbTokenService igdbTokenService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${twitch.client-id}")
    private String clientId;

    /**
     * 기존 DB에 장르가 비어있는(null) 게임들의 장르를 채워넣는 마이그레이션 로직
     */
    @Transactional
    public int migrateEmptyGenres() {
        // 1. DB에서 장르가 null인 게임만 조회 (조회 메소드가 없다면 findAll() 후 필터링도 가능)
        // 여기서는 안전하게 전체를 가져와서 장르가 없는 것만 처리하도록 구성합니다.
        List<Game> allGames = gameRepository.findAll();
        List<Game> targetGames = allGames.stream()
                .filter(game -> game.getGenre() == null || game.getGenre().trim().isEmpty())
                .collect(Collectors.toList());

        if (targetGames.isEmpty()) {
            log.info("✅ 마이그레이션할 빈 장르 데이터가 없습니다.");
            return 0;
        }

        String token = igdbTokenService.getAccessToken();
        if (token == null) return 0;

        String url = "https://api.igdb.com/v4/games";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", clientId);
        headers.set("Authorization", "Bearer " + token);
        headers.set("Accept", "application/json");

        int updatedCount = 0;

        for (Game localGame : targetGames) {
            try {
                // 각 게임의 고유 igdbGameId로 장르 정보만 콕 집어서 요청
                String queryBody = "fields genres.name; where id = " + localGame.getIgdbGameId() + ";";
                HttpEntity<String> entity = new HttpEntity<>(queryBody, headers);

                ResponseEntity<List<IgdbGameDto>> response = restTemplate.exchange(
                        url, HttpMethod.POST, entity, new ParameterizedTypeReference<List<IgdbGameDto>>() {}
                );

                List<IgdbGameDto> dtoList = response.getBody();
                if (dtoList != null && !dtoList.isEmpty()) {
                    IgdbGameDto dto = dtoList.get(0);

                    if (dto.getGenres() != null && !dto.getGenres().isEmpty()) {
                        String genreString = dto.getGenres().stream()
                                .map(IgdbGameDto.Genre::getName)
                                .collect(Collectors.joining(", "));

                        // 💡 중요: 기존 데이터 유지하며 장르만 새로 빌드하여 업데이트
                        Game updatedGame = Game.builder()
                                .id(localGame.getId()) // 기존 PK ID 유지
                                .igdbGameId(localGame.getIgdbGameId())
                                .title(localGame.getTitle())
                                .summary(localGame.getSummary())
                                .coverUrl(localGame.getCoverUrl())
                                .rating(localGame.getRating())
                                .platform(localGame.getPlatform())
                                .videoId(localGame.getVideoId())
                                .screenshots(localGame.getScreenshots())
                                .genre(genreString) // 🌟 새롭게 획득한 장르 추가
                                .build();

                        gameRepository.save(updatedGame);
                        updatedCount++;
                        log.info("✏️ 마이그레이션 완료 [{}]: {}", localGame.getTitle(), genreString);
                    }
                }

                // API 속도 제한(Rate Limit) 방지를 위해 아주 잠깐의 텀을 둠 (선택)
                Thread.sleep(100);

            } catch (Exception e) {
                log.error("❌ [{}] 게임 장르 마이그레이션 중 에러 발생: ", localGame.getTitle(), e);
            }
        }

        return updatedCount;
    }
}