package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.dto.gpt.DayDistributionDto;
import com.korit.trip_planner_back.dto.request.AccommodationDto;
import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.dto.response.ScheduleItemDto;
import com.korit.trip_planner_back.dto.response.TravelInfoDto;
import com.korit.trip_planner_back.dto.tsp.TspRequestDto;
import com.korit.trip_planner_back.dto.tsp.TspResponseDto;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final TspService tspService;
    private final TouristSpotMapper touristSpotMapper;
    private final GPTService gptService;

    public ItineraryRespDto createItinerary(ItineraryReqDto request) {
        log.info("=== 일정 생성 시작 ===");
        log.info("기간: {} ~ {}, 관광지: {}개",
                request.getStartDate(),
                request.getEndDate(),
                request.getSpotIds().size());

        // 1. 요청 검증
        validateRequest(request);

        // 2. 관광지 조회
        List<TouristSpot> allSpots = touristSpotMapper.findAllByIds(request.getSpotIds());
        log.info("관광지 조회 완료: {}개", allSpots.size());

        // 3. GPT 1차: 필터링 + Day 그룹핑
        DayDistributionDto distribution = gptService.filterAndGroupSpots(
                allSpots,
                request.getTravelDays(),
                request.getAccommodations(),
                request.getTransport()
        );

        log.info("선택: {}개, 제외: {}개",
                distribution.getSelectedSpots().size(),
                distribution.getExcludedSpots().size());

        // 4. 각 Day별 TSP 계산
        List<DayScheduleDto> days = calculateOptimalSchedules(request, distribution);

        log.info("TSP 계산 완료: {}일", days.size());

        // 5. GPT 2차: 최종 다듬기
        days = gptService.refineSchedule(days);

        // 6. 최종 응답 생성
        return buildFinalResponse(request, days);
    }

    /**
     * Day별 최적 일정 계산 (TSP)
     */
    private List<DayScheduleDto> calculateOptimalSchedules(
            ItineraryReqDto request,
            DayDistributionDto distribution) {

        List<DayScheduleDto> days = new ArrayList<>();
        Map<Integer, List<Integer>> dayGroups = distribution.getDayGroups();

        for (Map.Entry<Integer, List<Integer>> entry : dayGroups.entrySet()) {
            int day = entry.getKey();
            List<Integer> daySpotIds = entry.getValue();

            if (daySpotIds.isEmpty()) {
                log.warn("Day {}에 관광지가 없습니다.", day);
                continue;
            }

            log.info("Day {} TSP 계산: {}개 관광지", day, daySpotIds.size());

            if (daySpotIds.size() == 1) {
                log.info("Day {} 관광지 1개 - TSP 생략", day);
                DayScheduleDto daySchedule = buildSingleSpotSchedule(
                        day,
                        request.getStartDate().plusDays(day - 1),
                        daySpotIds.get(0),
                        request
                );
                days.add(daySchedule);
                continue;
            }

            // 출발지/도착지 결정
            LocationInfo start = getDayStartLocation(day, request);
            LocationInfo end = getDayEndLocation(day, request);

            // TSP 계산
            TspRequestDto tspRequest = TspRequestDto.builder()
                    .spotIds(daySpotIds)
                    .startLat(start.lat)
                    .startLon(start.lon)
                    .endLat(end.lat)
                    .endLon(end.lon)
                    .startName(start.name)
                    .endName(end.name)
                    .transportType(request.getTransport())
                    .build();

            TspResponseDto tspResult = tspService.calculateOptimalRoute(tspRequest);

            // Day 일정 생성
            DayScheduleDto daySchedule = buildDayScheduleFromTsp(
                    day,
                    request.getStartDate().plusDays(day - 1),
                    tspResult,
                    request
            );

            days.add(daySchedule);
        }

        return days;
    }

    private DayScheduleDto buildSingleSpotSchedule(
            int day,
            LocalDate date,
            Integer spotId,
            ItineraryReqDto request) {

        // DB에서 관광지 조회
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(List.of(spotId));

        if (spots.isEmpty()) {
            log.warn("관광지를 찾을 수 없습니다: {}", spotId);
            return null;
        }

        TouristSpot spot = spots.get(0);

        // 출발지 (공항 또는 전날 숙소)
        LocationInfo start = getDayStartLocation(day, request);

        LocalTime currentTime = LocalTime.of(9, 0);
        int duration = spot.getSpotDuration() > 0 ? spot.getSpotDuration() : 60;

        // 관광지 1개만
        ScheduleItemDto item = ScheduleItemDto.builder()
                .order(0)
                .type("SPOT")
                .itemId(spotId)
                .name(spot.getTitle())
                .category(spot.getCategory())
                .lat(spot.getLatitude())
                .lon(spot.getLongitude())
                .arrivalTime(currentTime)
                .duration(duration)
                .departureTime(currentTime.plusMinutes(duration))
                .cost(spot.getPrice())
                .isIsland(spot.isIsland())
                .description(spot.getDescription())
                .travelFromPrevious(null)  // 첫 번째라 없음
                .build();

        return DayScheduleDto.builder()
                .day(day)
                .date(date)
                .startTime(LocalTime.of(9, 0))
                .endTime(currentTime.plusMinutes(duration))
                .items(List.of(item))
                .totalDistance(0.0)
                .totalDuration(duration)
                .totalCost(spot.getPrice())
                .hasIsland(spot.isIsland())
                .summary(String.format("Day %d: 1개 관광지%s",
                        day,
                        spot.isIsland() ? " (섬 포함)" : ""))
                .build();
    }

    private LocationInfo getDayStartLocation(int day, ItineraryReqDto request) {
        if (day == 1) {
            // 첫날: 제주공항
            return new LocationInfo("제주국제공항", 33.5066, 126.4929);
        } else {
            // 둘째날 이후: 전날 숙소
            AccommodationDto accommodation = request.getAccommodations().get(day - 2);
            return new LocationInfo(
                    accommodation.getName() != null ? accommodation.getName() : "숙소",
                    accommodation.getLat(),
                    accommodation.getLon()
            );
        }
    }

    private LocationInfo getDayEndLocation(int day, ItineraryReqDto request) {
        int travelDays = request.getTravelDays();

        if (day == travelDays) {
            // 마지막 날: 제주공항
            return new LocationInfo("제주국제공항", 33.5066, 126.4929);
        } else {
            // 그 외: 당일 숙소
            AccommodationDto accommodation = request.getAccommodations().get(day - 1);
            return new LocationInfo(
                    accommodation.getName() != null ? accommodation.getName() : "숙소",
                    accommodation.getLat(),
                    accommodation.getLon()
            );
        }
    }

    private DayScheduleDto buildDayScheduleFromTsp(
            int day,
            LocalDate date,
            TspResponseDto tspResult,
            ItineraryReqDto request) {

        List<Integer> spotIds = tspResult.getOptimizedSpotIds();

        // DB에서 관광지 조회
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(spotIds);
        Map<Integer, TouristSpot> spotMap = spots.stream()
                .collect(Collectors.toMap(
                        spot -> (int) spot.getSpotId(),
                        spot -> spot
                ));

        // TSP 구간 정보 Map
        Map<String, com.korit.trip_planner_back.dto.tsp.RouteSegmentDto> segmentMap = new HashMap<>();
        if (tspResult.getRouteSegments() != null) {
            for (com.korit.trip_planner_back.dto.tsp.RouteSegmentDto segment : tspResult.getRouteSegments()) {
                String key = segment.getFromSpotId() + "-" + segment.getToSpotId();
                segmentMap.put(key, segment);
            }
        }

        List<ScheduleItemDto> items = new ArrayList<>();
        LocalTime currentTime = LocalTime.of(9, 0);

        boolean hasIsland = false;
        double totalDistance = 0.0;
        int totalTravelDuration = 0;
        int totalStayDuration = 0;
        int totalCost = 0;

        Integer fromSpotId = 0;  // 출발지

        // 각 관광지를 항목으로 변환
        for (int i = 0; i < spotIds.size(); i++) {
            Integer spotId = spotIds.get(i);
            TouristSpot spot = spotMap.get(spotId);

            if (spot == null) {
                log.warn("관광지를 찾을 수 없습니다: {}", spotId);
                continue;
            }

            if (spot.isIsland()) {
                hasIsland = true;
            }

            // 이동 정보
            TravelInfoDto travelInfo = null;
            String segmentKey = fromSpotId + "-" + spotId;
            com.korit.trip_planner_back.dto.tsp.RouteSegmentDto segment = segmentMap.get(segmentKey);

            if (segment != null && segment.getActualDistance() != null) {
                currentTime = currentTime.plusMinutes(segment.getDuration());
                totalTravelDuration += segment.getDuration();
                totalDistance += segment.getActualDistance();

                travelInfo = TravelInfoDto.builder()
                        .distance(segment.getActualDistance())
                        .duration(segment.getDuration())
                        .transportType(request.getTransport())
                        .build();
            }

            int duration = spot.getSpotDuration() > 0 ? spot.getSpotDuration() : 60;

            ScheduleItemDto item = ScheduleItemDto.builder()
                    .order(i)
                    .type("SPOT")
                    .itemId(spotId)
                    .name(spot.getTitle())
                    .category(spot.getCategory())
                    .lat(spot.getLatitude())
                    .lon(spot.getLongitude())
                    .arrivalTime(currentTime)
                    .duration(duration)
                    .departureTime(currentTime.plusMinutes(duration))
                    .cost(spot.getPrice())
                    .isIsland(spot.isIsland())
                    .description(spot.getDescription())
                    .travelFromPrevious(travelInfo)
                    .build();

            items.add(item);

            totalCost += spot.getPrice();
            totalStayDuration += duration;
            currentTime = currentTime.plusMinutes(duration);
            fromSpotId = spotId;
        }

        return DayScheduleDto.builder()
                .day(day)
                .date(date)
                .startTime(LocalTime.of(9, 0))
                .endTime(currentTime)
                .items(items)
                .totalDistance(totalDistance)
                .totalDuration(totalTravelDuration + totalStayDuration)
                .totalCost(totalCost)
                .hasIsland(hasIsland)
                .summary(String.format("Day %d: %d개 관광지, %.1fkm%s",
                        day,
                        spotIds.size(),
                        totalDistance,
                        hasIsland ? " (섬 포함)" : ""))
                .build();
    }

    /**
     * 위치 정보 클래스
     */
    private static class LocationInfo {
        String name;
        double lat;
        double lon;

        LocationInfo(String name, double lat, double lon) {
            this.name = name;
            this.lat = lat;
            this.lon = lon;
        }
    }

    /**
     * 요청 검증
     */
    private void validateRequest(ItineraryReqDto request) {
        // 날짜 검증
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("여행 날짜를 입력해주세요.");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("시작일이 종료일보다 늦습니다.");
        }

        // 관광지 검증
        if (request.getSpotIds() == null || request.getSpotIds().isEmpty()) {
            throw new IllegalArgumentException("관광지를 선택해주세요.");
        }

        if (request.getSpotIds().size() < 2) {
            throw new IllegalArgumentException("최소 2개 이상의 관광지를 선택해주세요.");
        }

        // 숙소 검증
        if (!request.hasValidAccommodations()) {
            throw new IllegalArgumentException(
                    String.format("숙소는 %d개가 필요합니다.", request.getNights()));
        }
    }

    /**
     * 최종 응답 생성
     */
    private ItineraryRespDto buildFinalResponse(ItineraryReqDto request, List<DayScheduleDto> days) {
        // 전체 거리/시간/비용 집계
        double totalDistance = days.stream()
                .mapToDouble(day -> day.getTotalDistance() != null ? day.getTotalDistance() : 0.0)
                .sum();

        int totalDuration = days.stream()
                .mapToInt(day -> day.getTotalDuration() != null ? day.getTotalDuration() : 0)
                .sum();

        int totalCost = days.stream()
                .mapToInt(day -> day.getTotalCost() != null ? day.getTotalCost() : 0)
                .sum();

        int totalSpots = days.stream()
                .mapToInt(day -> day.getItems() != null ? day.getItems().size() : 0)
                .sum();

        return ItineraryRespDto.builder()
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .transport(request.getTransport())
                .partyType(request.getPartyType())
                .days(days)
                .totalDistance(totalDistance)
                .totalDuration(totalDuration)
                .totalCost(totalCost)
                .totalSpots(totalSpots)
                .summary(String.format("%d박%d일, %d개 관광지, 총 %.1fkm, 약 %.1f시간",
                        request.getNights(),
                        request.getTravelDays(),
                        totalSpots,
                        totalDistance,
                        totalDuration / 60.0))
                .build();
    }
}