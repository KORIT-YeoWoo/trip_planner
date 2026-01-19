package com.korit.trip_planner_back.dto.request;

import com.korit.trip_planner_back.entity.Accommodation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationDto {
    private Integer dayNumber;
    private String name; // 숙소 이름
    private String address;
    private Double lat;
    private Double lon;

    // 유효성 검증
    public boolean isValid() {
        return dayNumber != null && dayNumber > 0
                && name != null && !name.trim().isEmpty()
                && lat != null && lon != null
                && lat >= -90 && lat <= 90
                && lon >= -180 && lon <= 180;
    }

    // Entity로 변환
    public Accommodation toEntity(Integer itineraryId){
        return Accommodation.builder()
                .itineraryId(itineraryId)
                .dayNumber(dayNumber)
                .name(name)
                .address(address)
                .latitude(lat)
                .longitude(lon)
                .build();
    }
}
