package com.korit.trip_planner_back.service.itinerary;

import com.korit.trip_planner_back.dto.response.*;
import com.korit.trip_planner_back.entity.*;
import com.korit.trip_planner_back.mapper.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryQueryService {

    private final ItineraryMapper itineraryMapper;
    private final ItineraryDayMapper itineraryDayMapper;
    private final ItineraryItemMapper itineraryItemMapper;
    private final TouristSpotMapper touristSpotMapper;
    private final DailyLocationMapper dailyLocationMapper;

    // 일정 단건 조회
    public ItineraryRespDto findById(Integer itineraryId) {

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
        return ItineraryRespDto.builder()
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
    }

    // Day 일정 생성
    private DayScheduleDto buildDaySchedule(Integer itineraryId, ItineraryDay day) {
        // 1. Day의 items 조회
        List<ItineraryItem> items = itineraryItemMapper.findByDayId(
                itineraryId,
                day.getDayNumber()
        );

        if (items.isEmpty()) {
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

    // 내 일정 목록 조회
    public List<ItineraryListDto> findMyItineraries(Integer userId) {
        // 1. 사용자의 일정 목록
        List<Itinerary> itineraries = itineraryMapper.findByUserId(userId);

        if (itineraries.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. 각 일정의 상세 정보 조회
        List<ItineraryListDto> result = new ArrayList<>();

        for (Itinerary itinerary : itineraries) {
            // 관광지 개수 조회
            List<ItineraryItem> items = itineraryItemMapper.findByItineraryId(itinerary.getItineraryId());

            int totalSpots = (int) items.stream()
                    .filter(item -> "SPOT".equals(item.getItemType()))
                    .count();

            // 첫 번째 관광지 이미지 (썸네일)
            String thumbnailUrl = null;
            if (!items.isEmpty()) {
                Integer firstSpotId = items.stream()
                        .filter(item -> "SPOT".equals(item.getItemType()))
                        .findFirst()
                        .map(ItineraryItem::getSpotId)
                        .orElse(null);

                if (firstSpotId != null) {
                    TouristSpot spot = touristSpotMapper.findById(firstSpotId);
                    if (spot != null && spot.getSpotImg() != null && !spot.getSpotImg().isEmpty()) {
                        thumbnailUrl = spot.getSpotImg();
                    }
                }
            }

            // DTO 생성
            ItineraryListDto dto = ItineraryListDto.builder()
                    .itineraryId(itinerary.getItineraryId())
                    .startDate(itinerary.getStartDate())
                    .endDate(itinerary.getEndDate())
                    .budget(itinerary.getBudget())
                    .transport(itinerary.getTransport())
                    .partyType(itinerary.getPartyType())
                    .totalCost(itinerary.getTotalCost())
                    .totalSpots(totalSpots)
                    .dayCount(ItineraryListDto.calculateDays(
                            itinerary.getStartDate(),
                            itinerary.getEndDate()
                    ))
                    .thumbnailUrl(thumbnailUrl)
                    .title(ItineraryListDto.generateTitle(
                            itinerary.getStartDate(),
                            itinerary.getEndDate()
                    ))
                    .build();

            result.add(dto);
        }
        return result;
    }
}