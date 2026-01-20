package com.korit.trip_planner_back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripPlans {
    private int planId;
    private int userId;
    private int spotId;
    private int dayId;
    private LocalDateTime createdAt;
}
