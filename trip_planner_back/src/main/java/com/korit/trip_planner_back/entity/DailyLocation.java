package com.korit.trip_planner_back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyLocation {

    private Integer dailyLocationId;
    private Integer itineraryId;
    private Integer dayNumber;

    // 출발지
    private String startName;       // 출발지 이름
    private String startAddress;    // 출발지 주소
    private Double startLat;        // 출발지 위도
    private Double startLon;        // 출발지 경도

    // 도착지
    private String endName;         // 도착지 이름
    private String endAddress;      // 도착지 주소
    private Double endLat;          // 도착지 위도
    private Double endLon;          // 도착지 경도

    private LocalDateTime createdAt;

    // 유효성 검증
    public boolean isValid(){
        return itineraryId != null
                && dayNumber != null && dayNumber > 0
                && isValidLocation(startName, startLat, startLon)
                && isValidLocation(endName, endLat, endLon);
    }

    // 위치 정보 유효성 검증
    private boolean isValidLocation(String name, Double lat, Double lon){
        return name != null && !name.trim().isEmpty()
                && lat != null && lon != null
                && lat >= 33.0 && lat <= 34.0       // 제주도 위도 범위
                && lon >= 126.0 && lon <= 127.0;    // 제주도 경도 범위
    }
}
