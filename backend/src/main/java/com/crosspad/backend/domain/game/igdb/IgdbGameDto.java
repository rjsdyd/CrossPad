package com.crosspad.backend.domain.game.igdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class IgdbGameDto {
    private Long id;
    private String name;
    private String summary;
    private Double rating;
    private Cover cover;
    private List<Integer> platforms;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Cover {
        private String url;
    }
}