package com.crosspad.backend.domain.game.igdb;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class IgdbGameDto {
    private Long id;
    private String name;
    private String summary;
    private Cover cover;
    private Double rating;
    private List<Integer> platforms;

    // 💡 [추가] IGDB 영상 및 스크린샷 데이터 바인딩용 필드
    private List<Video> videos;
    private List<Screenshot> screenshots;

    @Getter
    @Setter
    public static class Cover {
        private String url;
    }

    // 💡 [추가] 비디오 객체 구조
    @Getter
    @Setter
    public static class Video {
        private String video_id; // IGDB API 필드명과 일치해야 함
    }

    // 💡 [추가] 스크린샷 객체 구조
    @Getter
    @Setter
    public static class Screenshot {
        private String url;
    }
}