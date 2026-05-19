package com.crosspad.backend.domain.game.igdb;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class IgdbTokenService {

    @Value("${twitch.client-id}")
    private String clientId;

    @Value("${twitch.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    private String currentAccessToken;

    public String getAccessToken() {
        if (currentAccessToken != null) {
            return currentAccessToken; // 이미 발급받은 게 있으면 재사용
        }
        return fetchNewToken();
    }

    private String fetchNewToken() {
        String url = "https://id.twitch.tv/oauth2/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<TwitchTokenResponse> response = restTemplate.postForEntity(
                    url, request, TwitchTokenResponse.class);

            if (response.getBody() != null) {
                this.currentAccessToken = response.getBody().getAccessToken();
                log.info("🚀 트위치 IGDB Access Token 발급 대성공!");
                return this.currentAccessToken;
            }
        } catch (Exception e) {
            log.error("❌ 트위치 토큰 발급 실패: {}", e.getMessage());
        }
        return null;
    }
}