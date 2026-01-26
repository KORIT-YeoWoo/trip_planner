package com.korit.trip_planner_back.service.itinerary;

import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.entity.*;
import com.korit.trip_planner_back.mapper.*;
import com.korit.trip_planner_back.service.persistence.ItineraryPersistenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DayScheduleService {

    private final ItineraryValidator validator;
    private final DayScheduleBuilder dayScheduleBuilder;
    private final ItineraryPersistenceService persistenceService;

    private final ItineraryMapper itineraryMapper;
    private final DailyLocationMapper dailyLocationMapper;
    private final ItineraryItemMapper itineraryItemMapper;
    private final TouristSpotMapper touristSpotMapper;

    /**
     * Day 순서 변경
     */
    @Transactional
    public DayScheduleDto reorder(Integer itineraryId, Integer day, List<Integer> spotIds) {
        log.info("=== Day {} 순서 변경 시작 ===", day);

        // 1. 검증
        validator.validateReorderRequest(spotIds);

        // 2. DB 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        DailyLocation dayLocation = dailyLocationMapper
                .findByItineraryIdAndDay(itineraryId, day);

        if (itinerary == null || dayLocation == null) {
            throw new IllegalArgumentException("일정 정보를 찾을 수 없습니다.");
        }

        // 3. 관광지 조회 + 순서대로 정렬
        List<TouristSpot> orderedSpots = getOrderedSpots(spotIds);

        // 4. 새 일정 생성
        DayScheduleDto newSchedule = dayScheduleBuilder.build(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                orderedSpots,
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport()
        );

        // 5. DB 업데이트
        persistenceService.updateDaySchedule(itineraryId, day, newSchedule);

        log.info("=== Day {} 순서 변경 완료 ===", day);
        return newSchedule;
    }

    /**
     * 체류시간 변경
     */
    @Transactional
    public DayScheduleDto updateDuration(
            Integer itineraryId, Integer day, Integer spotId, Integer newDuration) {

        log.info("=== Day {} 체류 시간 변경: {} → {}분 ===", day, spotId, newDuration);

        // 1. 검증
        validator.validateDuration(newDuration);

        // 2. DB 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        DailyLocation dayLocation = dailyLocationMapper
                .findByItineraryIdAndDay(itineraryId, day);
        List<ItineraryItem> items = itineraryItemMapper
                .findByDayId(itineraryId, day);

        if (itinerary == null || dayLocation == null || items.isEmpty()) {
            throw new IllegalArgumentException("일정 정보를 찾을 수 없습니다.");
        }

        // 3. 관광지 조회 + duration 적용
        List<TouristSpot> spots = applyCustomDurations(items, spotId, newDuration);

        // 4. 새 일정 생성
        DayScheduleDto newSchedule = dayScheduleBuilder.build(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                spots,
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport()
        );

        // 5. DB 업데이트
        persistenceService.updateDaySchedule(itineraryId, day, newSchedule);

        log.info("=== Day {} 체류 시간 변경 완료 ===", day);
        return newSchedule;
    }

    /**
     * 관광지 삭제
     */
    @Transactional
    public DayScheduleDto deleteSpot(Integer itineraryId, Integer day, Integer spotId) {
        log.info("=== Day {} 관광지 삭제: spotId={} ===", day, spotId);

        // 1. 현재 아이템 조회
        List<ItineraryItem> currentItems = itineraryItemMapper
                .findByDayId(itineraryId, day);

        // 2. 삭제 후 남은 spotIds
        List<Integer> remainingSpotIds = currentItems.stream()
                .filter(item -> !item.getSpotId().equals(spotId))
                .map(ItineraryItem::getSpotId)
                .collect(Collectors.toList());

        // 3. 검증
        validator.validateDeleteRequest(remainingSpotIds);

        if (remainingSpotIds.size() == currentItems.size()) {
            throw new IllegalArgumentException("삭제할 관광지를 찾을 수 없습니다.");
        }

        // 4. DB 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        DailyLocation dayLocation = dailyLocationMapper
                .findByItineraryIdAndDay(itineraryId, day);

        // 5. 관광지 조회
        List<TouristSpot> remainingSpots = getOrderedSpots(remainingSpotIds);

        // 6. 새 일정 생성
        DayScheduleDto newSchedule = dayScheduleBuilder.build(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                remainingSpots,
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport()
        );

        // 7. DB 업데이트
        persistenceService.updateDaySchedule(itineraryId, day, newSchedule);

        log.info("=== Day {} 관광지 삭제 완료 ===", day);
        return newSchedule;
    }

    // ==================== Private 메서드 ====================

    private List<TouristSpot> getOrderedSpots(List<Integer> spotIds) {
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(spotIds);
        Map<Integer, TouristSpot> spotMap = spots.stream()
                .collect(Collectors.toMap(TouristSpot::getSpotId, s -> s));

        return spotIds.stream()
                .map(spotMap::get)
                .collect(Collectors.toList());
    }

    private List<TouristSpot> applyCustomDurations(
            List<ItineraryItem> items,
            Integer targetSpotId,
            Integer newDuration) {

        List<Integer> spotIds = items.stream()
                .map(ItineraryItem::getSpotId)
                .collect(Collectors.toList());

        List<TouristSpot> spots = touristSpotMapper.findAllByIds(spotIds);
        Map<Integer, TouristSpot> spotMap = spots.stream()
                .collect(Collectors.toMap(TouristSpot::getSpotId, s -> s));

        Map<Integer, Integer> currentDurations = items.stream()
                .collect(Collectors.toMap(
                        ItineraryItem::getSpotId,
                        ItineraryItem::getDuration));

        return spotIds.stream()
                .map(spotMap::get)
                .peek(spot -> {
                    if (Objects.equals(spot.getSpotId(), targetSpotId)) {
                        spot.setSpotDuration(newDuration);
                    } else {
                        spot.setSpotDuration(currentDurations.getOrDefault(
                                spot.getSpotId(), spot.getSpotDuration()));
                    }
                })
                .collect(Collectors.toList());
    }
}