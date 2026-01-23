package com.korit.trip_planner_back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelInfoDto {

    private double distance;
    private int duration;
    private String transportType; // 교통수단 - CAR, PUBLIC, WALK
    private List<List<Double>> path;

    // 평균 속도 (km/h)
    public double getAverageSpeed() {
        if (duration == 0) return 0;
        return (distance / duration) * 60;
    }

    // 이동 정보 요약
    public String getSummary() {
        return String.format("%.1fkm, %d분 (%s)",
                distance,
                duration,
                getTransportName());
    }

    // 교통수단 한글명
    private String getTransportName() {
        switch (transportType) {
            case "CAR": return "차량";
            case "PUBLIC": return "대중교통";
            case "WALK": return "도보";
            default: return transportType;
        }
    }
}