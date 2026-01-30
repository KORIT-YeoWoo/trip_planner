package com.korit.trip_planner_back.dto.response;

import com.korit.trip_planner_back.enums.TravelType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelStyleDTO {
    private Boolean isAnalyzable;
    private Integer currentTripCount;
    private Integer requiredTripCount;

    private TravelType type;
    private String typeName;
    private String typeDescription;

    private TravelStatsDTO stats;

    private String moveLevel;
    private String tourLevel;
    private String foodLevel;

    private java.util.List<String> preferredTags;
}