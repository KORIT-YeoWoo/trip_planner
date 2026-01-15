package com.korit.trip_planner_back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ItineraryRespDto {
    private int itinerariesId;
    private int userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int budget;         // 예산
    private String transport;   // 이동수단
    private String partyType;
    private int totalCost;      // 총 비용
    private LocalDateTime createdAt;

    private List<DayScheduleDto> days;  // Day별 일정 리스트
    private Double totalDistance;       // 총 이동 거리 (km)
    private Integer totalDuration;      // 총 이동 시간 (분)
    private Integer totalSpots;         // 총 관광지 개수
    private String summary;             // 전체 요약

    // 여행 일수
    public int getTravelDays() {
        if (days == null) return 0;
        return days.size();
    }

    // 총 소요 시간 (시간 단위)
    public Double getTotalDurationInHours() {
        if (totalDuration == null) return null;
        return totalDuration / 60.0;
    }

    // 예산 대비 실제 비용 비율
    public Double getBudgetRatio() {
        if (budget == 0) return null;
        return (double) totalCost / budget;
    }
}
