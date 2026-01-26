package com.korit.trip_planner_back.service.itinerary;

import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ItineraryValidator {

    private final TouristSpotMapper touristSpotMapper;

    /**
     * 일정 생성 요청 검증
     */
    public void validateCreateRequest(ItineraryReqDto request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("여행 날짜를 입력해주세요.");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("시작일이 종료일보다 늦습니다.");
        }

        if (request.getSpotIds() == null || request.getSpotIds().isEmpty()) {
            throw new IllegalArgumentException("최소 1개 이상의 관광지를 선택해주세요.");
        }

        if (!request.hasValidDailyLocations()) {
            throw new IllegalArgumentException("위치 정보가 올바르지 않습니다.");
        }
    }

    /**
     * 순서 변경 요청 검증
     */
    public void validateReorderRequest(List<Integer> spotIds) {
        if (spotIds == null || spotIds.isEmpty()) {
            throw new IllegalArgumentException("관광지 ID 리스트가 비어있습니다.");
        }

        List<TouristSpot> spots = touristSpotMapper.findAllByIds(spotIds);

        if (spots.size() != spotIds.size()) {
            throw new IllegalArgumentException("일부 관광지를 찾을 수 없습니다.");
        }

        long islandCount = spots.stream()
                .filter(TouristSpot::isIsland)
                .count();

        if (islandCount > 1) {
            throw new IllegalArgumentException("하루에 섬은 1개만 방문 가능합니다.");
        }

        if (islandCount == 1 && spotIds.size() > 3) {
            throw new IllegalArgumentException("섬이 있는 날은 최대 3개 관광지만 가능합니다.");
        }
    }

    /**
     * 체류시간 검증
     */
    public void validateDuration(Integer duration) {
        if (duration == null) {
            throw new IllegalArgumentException("체류 시간을 입력해주세요.");
        }

        if (duration < 10 || duration > 240) {
            throw new IllegalArgumentException("체류 시간은 10분~4시간 사이여야 합니다.");
        }
    }

    /**
     * 관광지 삭제 검증
     */
    public void validateDeleteRequest(List<Integer> remainingSpotIds) {
        if (remainingSpotIds == null || remainingSpotIds.isEmpty()) {
            throw new IllegalArgumentException("최소 1개 이상의 관광지가 필요합니다.");
        }
    }
}