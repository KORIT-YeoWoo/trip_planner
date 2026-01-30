package com.korit.trip_planner_back.dto.response;

import lombok.Data;

@Data
public class RatingSummaryResp {
    private double avgRating;
    private int reviewCount;
}
