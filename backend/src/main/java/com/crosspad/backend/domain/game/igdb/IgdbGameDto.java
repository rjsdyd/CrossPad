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

    // 🌟 [이 부분 추가] 실시간 플랫폼 판별을 위해 번호 리스트 필드를 추가합니다!
    private List<Long> platforms;

    private List<Video> videos;
    private List<Screenshot> screenshots;

    @Getter @Setter
    public static class Cover {
        private String url;
    }

    @Getter @Setter
    public static class Video {
        private String video_id;
    }

    @Getter @Setter
    public static class Screenshot {
        private String url;
    }
}