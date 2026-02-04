package com.korit.trip_planner_back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Slf4j
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
    private String startName;
    private Double startLat;
    private Double startLon;
    private String endName;
    private Double endLat;
    private Double endLon;
    private TravelInfoDto startToFirstTravel;

    public void calculateTotals() {
        if (items == null || items.isEmpty()) {
            this.totalDistance = 0.0;
            this.totalDuration = 0;
            this.totalCost = 0;
            return;
        }

        this.totalCost = items.stream()
                .mapToInt(item -> Optional.ofNullable(item.getCost()).orElse(0))
                .sum();

        this.totalDuration = items.stream()
                .mapToInt(item -> {
                    int stay = item.getDuration();  // 체류 시간
                    int travel = Optional.ofNullable(item.getTravelFromPrevious())
                            .map(TravelInfoDto::getDuration)
                            .orElse(0);  // 이동 시간
                    return stay + travel;
                })
                .sum();

        this.totalDistance = items.stream()
                .filter(item -> item.getTravelFromPrevious() != null)
                .mapToDouble(item -> Optional.ofNullable(item.getTravelFromPrevious().getDistance()).orElse(0.0))
                .sum();

        log.debug("calculateTotals() 완료 - Day {}: distance={}, duration={}, cost={}",
                getDay(), totalDistance, totalDuration, totalCost);
    }

}
