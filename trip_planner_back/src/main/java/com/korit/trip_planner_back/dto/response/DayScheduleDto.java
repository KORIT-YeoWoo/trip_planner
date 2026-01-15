package com.korit.trip_planner_back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayScheduleDto {
    private int day;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<ScheduleItemDto> items; // 일정 항목 리스트
    private Double totalDistance;
    private Integer totalDuration;
    private Integer totalCost;
    private boolean hasIsland;  // 섬 포함 여부
    private String summary;     // Day 요약

    // 관광지 개수 계산
    public int getSpotCount() {
        if (items == null) return 0;
        return (int) items.stream()
                .filter(item -> "SPOT".equals(item.getType()))
                .count();
    }

    // 식사 개수 계산
    public int getMealCount() {
        if (items == null) return 0;
        return (int) items.stream()
                .filter(item -> "MEAL".equals(item.getType()))
                .count();
    }

    // 총 소요 시간 (시간 단위)
    public Double getTotalDurationInHours() {
        if (totalDuration == null) return null;
        return totalDuration / 60.0;
    }
}
