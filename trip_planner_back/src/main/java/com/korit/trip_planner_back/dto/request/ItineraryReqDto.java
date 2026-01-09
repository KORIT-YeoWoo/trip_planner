package com.korit.trip_planner_back.dto.request;

import com.korit.trip_planner_back.entity.Itinerary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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
}
