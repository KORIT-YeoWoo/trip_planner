package com.korit.trip_planner_back.dto.tsp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TspResponseDto {

    private List<Integer> optimizedSpotIds;
    private List<RouteSegmentDto> routeSegments;
    private double totalStraightDistance;
    private Double totalActualDistance;
    private Integer totalDuration;
    private String algorithm;
    private Double improvementRate;
    private String transportType;
    private LocationInfo startPoint;
    private LocationInfo endPoint;
    private Long calculationTime;
    private int spotCount;

    public Double getTotalDurationInHours() {
        if (totalDuration == null) {
            return null;
        }
        return totalDuration / 60.0;
    }


    public Double getDistanceRatio() {
        if (totalActualDistance == null || totalStraightDistance == 0) {
            return null;
        }
        return totalActualDistance / totalStraightDistance;
    }

    public Double getAverageSpeed() {
        if (totalActualDistance == null || totalDuration == null || totalDuration == 0) {
            return null;
        }
        return (totalActualDistance / totalDuration) * 60;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LocationInfo {
        private String name;

        private double lat;
        private double lon;
    }

    public String getSummary() {
        StringBuilder sb = new StringBuilder();
        sb.append(spotCount).append("개 관광지");

        if (totalActualDistance != null) {
            sb.append(String.format(", 총 %.1fkm", totalActualDistance));
        } else {
            sb.append(String.format(", 총 %.1fkm (직선)", totalStraightDistance));
        }

        if (totalDuration != null) {
            int hours = totalDuration / 60;
            int minutes = totalDuration % 60;
            sb.append(String.format(", 약 %d시간", hours));
            if (minutes > 0) {
                sb.append(String.format(" %d분", minutes));
            }
        }

        return sb.toString();
    }
}