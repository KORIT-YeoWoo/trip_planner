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

public class TravelPlans {
    private int bookmarkId;
    private int userId;
    private int spotId;
    private int dayId;
    private LocalDateTime createdAt;
}
