package com.korit.trip_planner_back.dto.tsp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteSegmentDto {

    private Long fromSpotId;
    private String fromSpotName;
    private double fromLat;
    private double fromLon;
    private Long toSpotId;
    private String toSpotName;
    private double toLat;
    private double toLon;
    private double straightDistance;
    private Double actualDistance;
    private Integer duration;
    private int order;
    private String transportType;
    private Boolean isIslandSegment;

    public Double getDistanceRatio() {
        if (actualDistance == null || straightDistance == 0) {
            return null;
        }
        return actualDistance / straightDistance;
    }

    public Double getAverageSpeed() {
        if (actualDistance == null || duration == null || duration == 0) {
            return null;
        }
        return (actualDistance / duration) * 60; // 분 → 시간 변환
    }

    public String getSummary() {
        StringBuilder sb = new StringBuilder();
        sb.append(fromSpotName).append(" → ").append(toSpotName);

        if (actualDistance != null && duration != null) {
            sb.append(String.format(" (%.1fkm, %d분)", actualDistance, duration));
        } else {
            sb.append(String.format(" (직선: %.1fkm)", straightDistance));
        }

        return sb.toString();
    }
}