package com.korit.trip_planner_back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Itinerary {

    private Integer itineraryId;
    private Integer userId;
    private LocalDate startDate;      // 여행 시작일
    private LocalDate endDate;        // 여행 종료일
    private Integer budget;           // 예산
    private String transport;         // 이동수단
    private String partyType;         // 동행 유형
    private Integer totalCost;        // 총 비용
    private LocalDateTime createdAt;  // 생성일시

    private Double startLat;           // 출발지 위도
    private Double startLon;           // 출발지 경도

    public int getTravelDays() {
        if (startDate == null || endDate == null) return 0;
        return (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;
    }

    public int getTravelNights() {
        return getTravelDays() - 1;
    }
}