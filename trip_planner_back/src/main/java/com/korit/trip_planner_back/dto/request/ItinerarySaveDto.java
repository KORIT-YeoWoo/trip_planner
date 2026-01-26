package com.korit.trip_planner_back.dto.request;

import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * 일정 저장 요청 DTO
 *
 * 프론트엔드에서 생성한 전체 일정 데이터를 받아서 DB에 저장
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItinerarySaveDto {

    // 기본 정보
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer budget;
    private String transport;
    private String partyType;

    // 위치 정보
    private List<DailyLocationDto> dailyLocations;

    // 실제 일정 데이터
    private List<DayScheduleDto> days;

    // 유효성 검증
    public boolean isValid() {
        return startDate != null
                && endDate != null
                && days != null
                && !days.isEmpty()
                && dailyLocations != null
                && !dailyLocations.isEmpty();
    }
}