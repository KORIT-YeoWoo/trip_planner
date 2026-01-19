package com.korit.trip_planner_back.dto.request;

import com.korit.trip_planner_back.entity.DailyLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyLocationDto {
    private Integer day;

    // 출발지
    private String startName;
    private String startAddress;
    private Double startLat;
    private Double startLon;

    // 도착지
    private String endName;
    private String endAddress;
    private Double endLat;
    private Double endLon;

    // DTO -> Entity 변환
    public DailyLocation toEntity(Integer itineraryId) {
        return DailyLocation.builder()
                .itineraryId(itineraryId)
                .dayNumber(this.day)
                .startName(this.startName)
                .startAddress(this.startAddress)
                .startLat(this.startLat)
                .startLon(this.startLon)
                .endName(this.endName)
                .endAddress(this.endAddress)
                .endLat(this.endLat)
                .endLon(this.endLon)
                .build();
    }

    // Entity -> DTO 변환
    public static DailyLocationDto fromEntity(DailyLocation entity){
        return DailyLocationDto.builder()
                .day(entity.getDayNumber())
                .startName(entity.getStartName())
                .startAddress(entity.getStartAddress())
                .startLat(entity.getStartLat())
                .startLon(entity.getStartLon())
                .endName(entity.getEndName())
                .endAddress(entity.getEndAddress())
                .endLat(entity.getEndLat())
                .endLon(entity.getEndLon())
                .build();
    }

    // 유효성 검증
    public boolean isValid() {
        return day != null && day > 0
            && startName != null && !startName.trim().isEmpty()
            && startLat != null && startLon != null
            && endName != null && !endName.trim().isEmpty()
            && endLat != null && endLon != null;
    }
}
