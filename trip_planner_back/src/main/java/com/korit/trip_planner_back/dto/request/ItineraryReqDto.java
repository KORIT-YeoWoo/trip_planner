package com.korit.trip_planner_back.dto.request;

import com.korit.trip_planner_back.entity.Itinerary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryReqDto {
    private LocalDate startDate;
    private LocalDate endDate;
    private int budget;
    private String transport;
    private String partyType;

    private List<Integer> spotIds;
    private List<AccommodationDto> accommodations; // 숙소 위치 리스트

    // Itinerary 엔티티로 변환
    public Itinerary toEntity(int userId) {
        return Itinerary.builder()
                .userId(userId)
                .startDate(this.startDate)
                .endDate(this.endDate)
                .budget(this.budget)
                .transport(this.transport)
                .partyType(this.partyType)
                .build();
    }

    // 여행 일수 계산
    public int getTravelDays() {
        if (startDate == null || endDate == null) {
            return 0;
        }
        return (int) (endDate.toEpochDay() - startDate.toEpochDay() + 1);
    }

    // 숙박 수 계산
    public int getNights() {
        return getTravelDays() - 1;
    }

    // 숙소 개수 검증
    public boolean hasValidAccommodations() {
        if (accommodations == null) {
            return false;
        }
        return accommodations.size() == getNights();
    }

}