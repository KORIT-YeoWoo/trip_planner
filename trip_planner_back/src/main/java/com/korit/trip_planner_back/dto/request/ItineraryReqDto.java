package com.korit.trip_planner_back.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * 일정 생성 요청 DTO
 *
 * ✅ 변경사항:
 * - startLocation 제거
 * - accommodations 제거
 * - dailyLocations 추가 (Day별 출발지/도착지)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryReqDto {

    private List<Integer> spotIds;              // 선택된 관광지 ID
    private LocalDate startDate;                // 여행 시작일
    private LocalDate endDate;                  // 여행 종료일
    private Integer budget;                     // 총 예산
    private String transport;                   // 이동수단 (렌터카, 대중교통)
    private String partyType;                   // 동행 유형
    private List<DailyLocationDto> dailyLocations; // Day별 출발지/도착지 정보

    // 여행 일수 계산
    public int getTravelDays() {
        if (startDate == null || endDate == null) return 0;
        return (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;
    }

    // 숙박 일수 계산
    public int getNights() {
        return getTravelDays() - 1;
    }

    // dailyLocations 유효성 검증
    public boolean hasValidDailyLocations() {
        if (dailyLocations == null || dailyLocations.isEmpty()) {
            return false;
        }

        // 개수 확인
        if (dailyLocations.size() != getTravelDays()) {
            return false;
        }

        // 각 위치 정보 유효성 확인
        return dailyLocations.stream().allMatch(DailyLocationDto::isValid);
    }
}