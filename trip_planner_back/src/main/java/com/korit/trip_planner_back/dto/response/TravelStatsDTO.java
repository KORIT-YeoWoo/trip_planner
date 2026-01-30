package com.korit.trip_planner_back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelStatsDTO {
    private Integer totalTrips;
    private Integer totalDays;
    private Double totalDistance;
    private Double totalBudget;
    private Integer totalPlaces;

    private Double avgDistancePerDay;
    private Double avgTouristPerDay;
    private Double avgRestaurantPerDay;
    private Double avgRestaurantPrice;
}