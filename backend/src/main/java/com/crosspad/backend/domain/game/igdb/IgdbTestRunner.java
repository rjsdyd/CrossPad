package com.crosspad.backend.domain.game.igdb;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class IgdbTestRunner {

    private final IgdbTokenService igdbTokenService;
    private final IgdbApiService igdbApiService;

    @PostConstruct
    public void testToken() {
        String token = igdbTokenService.getAccessToken();
        log.info("🎯 테스트 완료! 현재 크로스패드의 출입증: {}", token);

        if (token != null) {
            igdbApiService.testFetchGames();
        }
    }
}