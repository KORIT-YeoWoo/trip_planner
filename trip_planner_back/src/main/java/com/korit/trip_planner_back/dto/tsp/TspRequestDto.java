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
public class TspRequestDto {

    private List<Integer> spotIds;
    private double startLat;
    private double startLon;
    private Double endLat;
    private Double endLon;
    private String transportType;
    private String startName;
    private String endName;

    public String getTransportType() {
        return transportType != null ? transportType : "CAR";
    }

    public boolean hasEndPoint() {
        return endLat != null && endLon != null;
    }

    public void validate() {
        if (spotIds == null || spotIds.isEmpty()) {
            throw new IllegalArgumentException("관광지 ID 리스트가 비어있습니다.");
        }

        if (spotIds.size() < 2) {
            throw new IllegalArgumentException("최소 2개 이상의 관광지가 필요합니다.");
        }

        if (spotIds.size() > 30) {
            throw new IllegalArgumentException("관광지는 최대 30개까지 선택 가능합니다.");
        }

        if (startLat < -90 || startLat > 90) {
            throw new IllegalArgumentException("출발지 위도가 유효하지 않습니다. (-90 ~ 90)");
        }

        if (startLon < -180 || startLon > 180) {
            throw new IllegalArgumentException("출발지 경도가 유효하지 않습니다. (-180 ~ 180)");
        }

        // 도착지가 있는 경우 검증
        if (hasEndPoint()) {
            if (endLat < -90 || endLat > 90) {
                throw new IllegalArgumentException("도착지 위도가 유효하지 않습니다. (-90 ~ 90)");
            }

            if (endLon < -180 || endLon > 180) {
                throw new IllegalArgumentException("도착지 경도가 유효하지 않습니다. (-180 ~ 180)");
            }
        }
    }
}