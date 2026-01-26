package com.korit.trip_planner_back.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIScheduleResponse {
    private List<DaySchedule> days;
    private List<Integer> excluded;
    private String excludeReason;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DaySchedule {
        private int day;
        private List<ScheduleItem> items;
        private String reasoning;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleItem {
        private String type;            // "SPOT", "MEAL"
        private Integer spotId;         // SPOT일 때만
        private String name;
        private String reason;          // AI 특별 이유
        private String suggestedTime;   // MEAL일 때 제안 시간
        private Integer duration;       // MEAL일 때 소요 시간
    }
}