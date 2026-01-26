// entity/ItineraryItem.java (기존 파일 수정)
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
    private Integer spotId;              // NULL 가능 (MEAL일 때)
    private Integer sequenceOrder;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private Integer duration;
    private Integer originalDuration;
    private Integer travelTime;
    private Double travelDistance;
    private Integer cost;
    private String itemType;             // "SPOT", "MEAL"
    private String itemName;             // 식사 이름

    private LocalDateTime createdAt;
}