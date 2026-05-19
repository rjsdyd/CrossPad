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

        // 💡 [수정 1] fields 맨 끝에 platforms 항목을 추가했습니다.
        String query = "fields id, name, summary, rating, cover.url, platforms; " +
                "where platforms = (130, 167) & rating >= 80; " +
                "sort rating desc; " +
                "limit 50;";

        HttpEntity<String> entity = new HttpEntity<>(query, headers);

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
                if (gameRepository.existsByIgdbGameId(dto.getId())) {
                    continue;
                }

                String coverUrl = (dto.getCover() != null) ? "https:" + dto.getCover().getUrl() : null;

                String platform = "PLAYSTATION";
                if (dto.getPlatforms() != null && dto.getPlatforms().contains(130)) {
                    platform = "NINTENDO";
                }

                Game game = Game.builder()
                        .igdbGameId(dto.getId())
                        .title(dto.getName())
                        .summary(dto.getSummary())
                        .coverUrl(coverUrl)
                        .rating(dto.getRating())
                        .platform(platform) // 동적으로 구한 값 주입!
                        .build();

                gameRepository.save(game);
                savedCount++;
            }

            log.info("🎯 [DB 캐싱 완료] 총 {}개의 새로운 명작 게임이 플랫폼 분류되어 MariaDB에 안전하게 저장되었습니다!", savedCount);

        } catch (Exception e) {
            log.error("❌ 게임 데이터 DB 캐싱 실패: {}", e.getMessage(), e);
        }
    }
}