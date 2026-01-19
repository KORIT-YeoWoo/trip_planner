package com.korit.trip_planner_back.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartLocationDto {
    private String name;
    private Double lat;
    private Double lon;

    // 기본 출발지 (제주공항)
    public static StartLocationDto createDefault() {
        return StartLocationDto.builder()
                .name("제주국제공항")
                .lat(33.5066)
                .lon(126.4929)
                .build();
    }

    // 유효성 검증
    public boolean isValid(){
        return name != null && !name.trim().isEmpty()
                && lat != null && lon != null
                && lat >= -90 && lat <= 90
                && lon >= -180 && lon <= 180;
    }
}
