package com.korit.trip_planner_back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ItineraryDay {
    private String dayId;
    private String itineraryId;
    private String dayNumber;
    private LocalDate date;
    private String aiComment;
}
