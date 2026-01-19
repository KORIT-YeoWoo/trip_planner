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
public class Accommodation {
    private Integer accommodationId;
    private Integer itineraryId;
    private Integer dayNumber;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;

    // 유효성 검증
    public boolean isValid(){
        return itineraryId != null
                && dayNumber != null && dayNumber > 0
                && name != null && !name.trim().isEmpty()
                && latitude != null && longitude != null;
    }
}
