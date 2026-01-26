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
    private Integer dayId;
    private Integer itineraryId;
    private Integer dayNumber;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate date;
    private String aiComment;            // AI 코멘트
}