package com.korit.trip_planner_back.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationDto {
    private int day;
    private String name; // 숙소 이름
    private double lat;
    private double lon;
}
