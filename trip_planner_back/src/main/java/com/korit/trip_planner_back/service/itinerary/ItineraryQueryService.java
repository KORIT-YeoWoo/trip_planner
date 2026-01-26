// service/itinerary/ItineraryQueryService.java
package com.korit.trip_planner_back.service.itinerary;

import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.dto.response.ScheduleItemDto;
import com.korit.trip_planner_back.dto.response.TravelInfoDto;
import com.korit.trip_planner_back.entity.*;
import com.korit.trip_planner_back.mapper.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 일정 조회 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryQueryService {

    private final ItineraryMapper itineraryMapper;
    private final ItineraryDayMapper itineraryDayMapper;
    private final ItineraryItemMapper itineraryItemMapper;
    private final TouristSpotMapper touristSpotMapper;
    private final DailyLocationMapper dailyLocationMapper;

    /**
     * 일정 단건 조회
     */
    public ItineraryRespDto findById(Integer itineraryId) {
        log.info("=== 일정 조회 시작: ID={} ===", itineraryId);

        // 1. 일정 기본 정보
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        if (itinerary == null) {
            throw new RuntimeException("일정을 찾을 수 없습니다: ID=" + itineraryId);
        }

        // 2. Day 정보
        List<ItineraryDay> itineraryDays = itineraryDayMapper.findByItineraryId(itineraryId);

        // 3. 각 Day별 일정 생성
        List<DayScheduleDto> days = new ArrayList<>();

        for (ItineraryDay day : itineraryDays) {
            DayScheduleDto daySchedule = buildDaySchedule(itineraryId, day);
            days.add(daySchedule);
        }

        // 4. 총계 계산
        double totalDistance = days.stream()
                .mapToDouble(d -> d.getTotalDistance() != null ? d.getTotalDistance() : 0.0)
                .sum();

        int totalDuration = days.stream()
                .mapToInt(d -> d.getTotalDuration() != null ? d.getTotalDuration() : 0)
                .sum();

        int totalCost = days.stream()
                .mapToInt(d -> d.getTotalCost() != null ? d.getTotalCost() : 0)
                .sum();

        int totalSpots = days.stream()
                .mapToInt(d -> (int) d.getItems().stream()
                        .filter(item -> "SPOT".equals(item.getType()))
                        .count())
                .sum();

        // 5. 최종 응답
        ItineraryRespDto response = ItineraryRespDto.builder()
                .itineraryId(itinerary.getItineraryId())
                .startDate(itinerary.getStartDate())
                .endDate(itinerary.getEndDate())
                .budget(itinerary.getBudget())
                .transport(itinerary.getTransport())
                .partyType(itinerary.getPartyType())
                .days(days)
                .totalDistance(totalDistance)
                .totalDuration(totalDuration)
                .totalCost(totalCost)
                .totalSpots(totalSpots)
                .build();

        log.info("=== 일정 조회 완료: {}일, {}개 관광지 ===", days.size(), totalSpots);

        return response;
    }

    /**
     * Day 일정 생성
     */
    private DayScheduleDto buildDaySchedule(Integer itineraryId, ItineraryDay day) {
        // 1. Day의 items 조회
        List<ItineraryItem> items = itineraryItemMapper.findByDayId(
                itineraryId,
                day.getDayNumber()
        );

        if (items.isEmpty()) {
            log.warn("Day {}에 항목이 없습니다", day.getDayNumber());
            return DayScheduleDto.builder()
                    .day(day.getDayNumber())
                    .date(day.getDate())
                    .startTime(day.getStartTime())
                    .endTime(day.getEndTime())
                    .items(new ArrayList<>())
                    .build();
        }

        // 2. spotId 목록 추출 (SPOT 타입만)
        List<Integer> spotIds = items.stream()
                .filter(item -> "SPOT".equals(item.getItemType()) && item.getSpotId() != null)
                .map(ItineraryItem::getSpotId)
                .collect(Collectors.toList());

        // 3. 관광지 정보 조회
        Map<Integer, TouristSpot> spotMap = new HashMap<>();
        if (!spotIds.isEmpty()) {
            List<TouristSpot> spots = touristSpotMapper.findAllByIds(spotIds);
            spotMap = spots.stream()
                    .collect(Collectors.toMap(TouristSpot::getSpotId, s -> s));
        }

        // 4. 출발/도착 정보 조회
        DailyLocation dailyLocation = dailyLocationMapper.findByItineraryIdAndDay(
                itineraryId,
                day.getDayNumber()
        );

        // 5. ScheduleItemDto 리스트 생성
        List<ScheduleItemDto> scheduleItems = new ArrayList<>();

        for (ItineraryItem item : items) {
            ScheduleItemDto scheduleItem;

            if ("SPOT".equals(item.getItemType())) {
                // 관광지
                TouristSpot spot = spotMap.get(item.getSpotId());
                if (spot == null) {
                    log.warn("관광지를 찾을 수 없습니다: spotId={}", item.getSpotId());
                    continue;
                }

                scheduleItem = ScheduleItemDto.builder()
                        .order(item.getSequenceOrder())
                        .type("SPOT")
                        .spotId(spot.getSpotId())
                        .name(spot.getTitle())
                        .category(spot.getCategory())
                        .lat(spot.getLatitude())
                        .lon(spot.getLongitude())
                        .arrivalTime(item.getArrivalTime())
                        .duration(item.getDuration())
                        .departureTime(item.getDepartureTime())
                        .cost(item.getCost() != null ? item.getCost() : spot.getPrice())
                        .isIsland(spot.isIsland())
                        .build();

                // 이동 정보
                if (item.getTravelTime() != null && item.getTravelDistance() != null) {
                    TravelInfoDto travelInfo = TravelInfoDto.builder()
                            .distance(item.getTravelDistance())
                            .duration(item.getTravelTime())
                            .build();
                    scheduleItem.setTravelFromPrevious(travelInfo);
                }

            } else if ("MEAL".equals(item.getItemType())) {
                // 식사
                scheduleItem = ScheduleItemDto.builder()
                        .order(item.getSequenceOrder())
                        .type("MEAL")
                        .name(item.getItemName())  // "점심 식사", "저녁 식사"
                        .arrivalTime(item.getArrivalTime())
                        .duration(item.getDuration())
                        .departureTime(item.getDepartureTime())
                        .cost(item.getCost() != null ? item.getCost() : 15000)
                        .build();

            } else {
                log.warn("알 수 없는 item_type: {}", item.getItemType());
                continue;
            }

            scheduleItems.add(scheduleItem);
        }

        // 6. DayScheduleDto 생성
        DayScheduleDto daySchedule = DayScheduleDto.builder()
                .day(day.getDayNumber())
                .date(day.getDate())
                .startTime(day.getStartTime())
                .endTime(day.getEndTime())
                .items(scheduleItems)
                .summary(day.getAiComment())  // AI 코멘트
                .build();

        // 출발/도착 정보 추가
        if (dailyLocation != null) {
            daySchedule.setStartLat(dailyLocation.getStartLat());
            daySchedule.setStartLon(dailyLocation.getStartLon());
            daySchedule.setEndLat(dailyLocation.getEndLat());
            daySchedule.setEndLon(dailyLocation.getEndLon());
        }

        // 7. 총계 계산
        daySchedule.calculateTotals();

        return daySchedule;
    }

    /**
     * 사용자별 일정 목록 조회 (추가 기능)
     */
//    public List<ItineraryRespDto> findByUserId(Integer userId) {
//        List<Itinerary> itineraries = itineraryMapper.findByUserId(userId);
//
//        return itineraries.stream()
//                .map(itinerary -> findById(itinerary.getItineraryId()))
//                .collect(Collectors.toList());
//    }
}