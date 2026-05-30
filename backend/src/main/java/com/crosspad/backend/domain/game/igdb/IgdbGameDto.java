package com.crosspad.backend.domain.game.igdb;

import lombok.Data;
import java.util.List;

@Data
public class IgdbGameDto {
    private Long id;
    private String name;
    private String summary;
    private Cover cover;
    private Double rating;
    private List<Long> platforms;

    // 💡 [추가] 장르 데이터를 담을 리스트 바구니
    private List<Genre> genres;

    private List<Video> videos;
    private List<Screenshot> screenshots;

    @Data
    public static class Cover {
        private String url;
    }

    // 💡 [추가] 장르 이름(name)을 받을 내부 클래스
    @Data
    public static class Genre {
        private String name;
    }

    @Data
    public static class Video {
        private String video_id;
    }

    @Data
    public static class Screenshot {
        private String url;
    }
}