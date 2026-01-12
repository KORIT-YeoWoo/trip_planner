package com.korit.trip_planner_back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ItineraryDay {
    private String dayId;
    private String itineraryId;
    private String dayNumber;
    private LocalTime startDate;
    private LocalTime endDate;
    private LocalDate date;
    private String aiComment;
}
