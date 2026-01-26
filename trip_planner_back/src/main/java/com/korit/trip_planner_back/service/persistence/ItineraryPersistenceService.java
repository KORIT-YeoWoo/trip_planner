package com.korit.trip_planner_back.service.persistence;

import com.korit.trip_planner_back.dto.request.DailyLocationDto;
import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ScheduleItemDto;
import com.korit.trip_planner_back.entity.*;
import com.korit.trip_planner_back.mapper.*;
import com.korit.trip_planner_back.security.PrincipalUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 일정 DB 저장 전담
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryPersistenceService {

    private final ItineraryMapper itineraryMapper;
    private final DailyLocationMapper dailyLocationMapper;
    private final ItineraryDayMapper itineraryDayMapper;
    private final ItineraryItemMapper itineraryItemMapper;

    /**
     * 일정 기본 정보 저장
     */
    @Transactional
    public Itinerary saveItinerary(ItineraryReqDto request) {
        Itinerary itinerary = Itinerary.builder()
                .userId(getCurrentUserId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .transport(request.getTransport())
                .partyType(request.getPartyType())
                .totalCost(0)
                .build();

        itineraryMapper.insert(itinerary);
        log.info("일정 기본 정보 저장 완료: ID={}", itinerary.getItineraryId());

        return itinerary;
    }

    /**
     * 출발지/도착지 정보 저장
     */
    @Transactional
    public void saveDailyLocations(Integer itineraryId, List<DailyLocationDto> locations) {
        for (DailyLocationDto locDto : locations) {
            dailyLocationMapper.insert(locDto.toEntity(itineraryId));
        }
        log.info("출발/도착지 정보 저장 완료: {}일", locations.size());
    }

    /**
     * Day별 일정 저장
     */
    @Transactional
    public void saveDaySchedules(Integer itineraryId, List<DayScheduleDto> days) {
        log.info("=== Day 일정 DB 저장 시작 ===");

        for (DayScheduleDto dayDto : days) {
            // itinerary_days INSERT
            ItineraryDay day = ItineraryDay.builder()
                    .itineraryId(itineraryId)
                    .dayNumber(dayDto.getDay())
                    .date(dayDto.getDate())
                    .startTime(dayDto.getStartTime())
                    .endTime(dayDto.getEndTime())
                    .aiComment(dayDto.getSummary())  // AI 코멘트
                    .build();

            itineraryDayMapper.insert(day);

            // itinerary_items INSERT
            saveDayItems(itineraryId, dayDto);

            log.info("Day {} 저장 완료: {}개 항목",
                    dayDto.getDay(), dayDto.getItems().size());
        }

        log.info("=== Day 일정 DB 저장 완료: {}일 ===", days.size());
    }

    /**
     * Day의 개별 항목 저장
     */
    private void saveDayItems(Integer itineraryId, DayScheduleDto dayDto) {
        for (ScheduleItemDto item : dayDto.getItems()) {
            ItineraryItem itemEntity = ItineraryItem.builder()
                    .itineraryId(itineraryId)
                    .day(dayDto.getDay())
                    .sequenceOrder(item.getOrder())
                    .arrivalTime(item.getArrivalTime())
                    .departureTime(item.getDepartureTime())
                    .duration(item.getDuration())
                    .originalDuration(item.getDuration())
                    .cost(item.getCost())
                    .itemType("SPOT")
                    .spotId(item.getSpotId())
                    .itemName(item.getName())
                    .build();

            if (item.getTravelFromPrevious() != null) {
                itemEntity.setTravelTime(item.getTravelFromPrevious().getDuration());
                itemEntity.setTravelDistance(item.getTravelFromPrevious().getDistance());
            }

            itineraryItemMapper.insert(itemEntity);

            log.info("✅ 관광지 저장: {}", item.getName());
        }
    }

    /**
     * 특정 Day 일정 업데이트 (기존 삭제 + 새로 저장)
     */
    @Transactional
    public void updateDaySchedule(Integer itineraryId, Integer day, DayScheduleDto schedule) {
        // 1. 기존 items 삭제
        itineraryItemMapper.deleteByDay(itineraryId, day);

        // 2. Day 정보 업데이트
        ItineraryDay dayEntity = itineraryDayMapper.findByItineraryIdAndDay(itineraryId, day);
        if (dayEntity != null) {
            dayEntity.setStartTime(schedule.getStartTime());
            dayEntity.setEndTime(schedule.getEndTime());
            itineraryDayMapper.update(dayEntity);
        }

        // 3. 새 items 저장
        saveDayItems(itineraryId, schedule);

        log.info("Day {} 일정 업데이트 완료", day);
    }

    /**
     * 현재 로그인한 사용자 ID
     */
    private Integer getCurrentUserId() {
        // ✅ 수정: 안전한 캐스팅
        PrincipalUser principalUser = PrincipalUser.getAuthenticatedPrincipalUser();

        if (principalUser == null) {
            log.warn("⚠️ 로그인 정보 없음 - 테스트용 userId=1 사용");
            return 1;
        }

        return principalUser.getUser().getUserId();
    }
}