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
    private int itinerariesId;
    private int userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int budget;         // 예산
    private String transport;   // 이동수단
    private String partyType;
    private int totalCost;      // 총 비용
    private LocalDateTime createdAt;
}
