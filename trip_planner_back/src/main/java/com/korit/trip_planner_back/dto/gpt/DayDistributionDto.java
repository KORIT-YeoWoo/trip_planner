package com.korit.trip_planner_back.dto.gpt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayDistributionDto {

    private List<Integer> selectedSpots;
    private List<Integer> excludedSpots;
    private String excludeReason;
    private Map<Integer, List<Integer>> dayGroups;
}