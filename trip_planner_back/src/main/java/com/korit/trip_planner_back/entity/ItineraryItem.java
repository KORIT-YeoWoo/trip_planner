package com.korit.trip_planner_back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryItem {
    private Integer itemId;
    private Integer itineraryId;
    private Integer day;
    private Integer spotId;
    private Integer sequenceOrder;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private Integer duration;
    private Integer originalDuration;
    private Integer travelTime;
    private Double travelDistance;
    private Integer cost;
    private String routePath;
    private LocalDateTime createdAt;
}