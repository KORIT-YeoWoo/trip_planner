package com.korit.trip_planner_back.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScheduleItemDto {
    private int order;
    private String type; // 유형 - SPOT: 관광지, MEAL: 식사, ACCOMMODATION: 숙소
    private int spotId;
    private String name;
    private String category;
    private double lat;
    private double lon;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private int duration;
    private Integer cost;
    private boolean isIsland;
    private String description; // 설명
    private TravelInfoDto travelFromPrevious; // 이전 지점에서 이동 정보

    // 시간 요약
    public String getTimeSlot() {
        if (arrivalTime == null || departureTime == null){
            return null;
        }
        return String.format("%s - %s (%d분)",
            arrivalTime, departureTime, duration);
    }

    // 체류 시간
    public double getDurationInHours(){
        return duration / 60.0;
    }
}

