package com.korit.trip_planner_back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 일정 목록용 DTO (간단한 정보만)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryListDto {
    private Integer itineraryId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer budget;
    private String transport;
    private String partyType;
    private Integer totalCost;
    private Integer totalSpots;      // 총 관광지 개수
    private Integer dayCount;        // 여행 일수
    private String thumbnailUrl;     // 썸네일 (첫 번째 관광지 이미지)
    private String title;            // "제주도 3박4일"

    // 여행 일수 계산
    public static int calculateDays(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) return 0;
        return (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;
    }

    // 제목 생성
    public static String generateTitle(LocalDate startDate, LocalDate endDate) {
        int days = calculateDays(startDate, endDate);
        int nights = days - 1;
        return String.format("제주도 %d박%d일", nights, days);
    }
}