package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.dto.gpt.DayDistributionDto;
import com.korit.trip_planner_back.dto.request.DailyLocationDto;
import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.dto.response.ScheduleItemDto;
import com.korit.trip_planner_back.dto.response.TravelInfoDto;
import com.korit.trip_planner_back.dto.tsp.TspRequestDto;
import com.korit.trip_planner_back.dto.tsp.TspResponseDto;
import com.korit.trip_planner_back.entity.DailyLocation;
import com.korit.trip_planner_back.entity.Itinerary;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.DailyLocationMapper;
import com.korit.trip_planner_back.mapper.ItineraryMapper;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final TspService tspService;
    private final TouristSpotMapper touristSpotMapper;
    private final GPTService gptService;
    private final KakaoNaviService kakaoNaviService;
    private final ItineraryMapper itineraryMapper;
    private final DailyLocationMapper dailyLocationMapper;

    public ItineraryRespDto createItinerary(ItineraryReqDto request) {
        log.info("=== 일정 생성 시작 ===");
        log.info("기간: {} ~ {}, 관광지: {}개",
                request.getStartDate(),
                request.getEndDate(),
                request.getSpotIds().size());

        // 1. 요청 검증
        validateRequest(request);

        // 2. 일정 정보 DB 저장
        Itinerary itinerary = saveItinerary(request);
        log.info("일정 저장 완료: ID={}", itinerary.getItineraryId());

        // 3. Day별 위치 정보 DB 저장
        saveDailyLocations(itinerary.getItineraryId(), request.getDailyLocations());
        log.info("위치 정보 저장 완료: {}일", request.getDailyLocations().size());

        // 4. 관광지 조회
        List<TouristSpot> allSpots = touristSpotMapper.findAllByIds(request.getSpotIds());
        log.info("관광지 조회 완료: {}개", allSpots.size());

        // 5. GPT 1차: 필터링 + Day 그룹핑
        DayDistributionDto distribution = gptService.filterAndGroupSpots(
                allSpots,
                request.getTravelDays(),
                request.getDailyLocations(),
                request.getTransport()
        );

        log.info("선택: {}개, 제외: {}개",
                distribution.getSelectedSpots().size(),
                distribution.getExcludedSpots().size());

        // 6. 각 Day별 TSP 계산
        List<DayScheduleDto> days = calculateOptimalSchedules(request, distribution);

        log.info("TSP 계산 완료: {}일", days.size());

        // 7. GPT 2차: 최종 다듬기
        days = gptService.refineSchedule(days);

        // 8. 최종 응답 생성
        ItineraryRespDto response = buildFinalResponse(request, days);

        // 9. itineraryId 포함
        response.setItineraryId(itinerary.getItineraryId());
        return response;
    }

    // Day별 최적 일정 계산 (TSP)
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

    // 일정 정보 DB 저장
    private Itinerary saveItinerary(ItineraryReqDto request) {
        Itinerary itinerary = Itinerary.builder()
                .userId(1)  // TODO: 실제 로그인 사용자 ID
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .transport(request.getTransport())
                .partyType(request.getPartyType())
                .totalCost(0)
                .build();

        itineraryMapper.insert(itinerary);

        return itinerary;
    }

    // Day별 위치 정보 DB 저장
    private void saveDailyLocations(Integer itineraryId, List<DailyLocationDto> locations) {
        if (locations == null || locations.isEmpty()) {
            throw new IllegalArgumentException("위치 정보가 없습니다.");
        }

        for (DailyLocationDto locDto : locations) {
            DailyLocation location = locDto.toEntity(itineraryId);

            dailyLocationMapper.insert(location);

            log.debug("Day {} 위치 저장: {} → {}",
                    locDto.getDay(),
                    locDto.getStartName(),
                    locDto.getEndName());
        }
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

    // Day별 출발지 결정
    private LocationInfo getDayStartLocation(int day, ItineraryReqDto request) {
        DailyLocationDto dayLoc = request.getDailyLocations().get(day - 1);

        return new LocationInfo(
                dayLoc.getStartName(),
                dayLoc.getStartLat(),
                dayLoc.getStartLon()
        );
    }

    // Day별 도착지 결정
    private LocationInfo getDayEndLocation(int day, ItineraryReqDto request) {
        DailyLocationDto dayLoc = request.getDailyLocations().get(day - 1);

        return new LocationInfo(
                dayLoc.getEndName(),
                dayLoc.getEndLat(),
                dayLoc.getEndLon()
        );
    }

    // 요청 검증
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

        // ✅ 변경: dailyLocations 검증
        if (!request.hasValidDailyLocations()) {
            throw new IllegalArgumentException(
                    String.format("위치 정보가 올바르지 않습니다. (%d일 여행 = %d개 위치 정보 필요)",
                            request.getTravelDays(), request.getTravelDays()));
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

    // 최종 응답 생성
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

    // Day 일정 순서 변경
    public DayScheduleDto reorderDaySchedule(
            Integer itineraryId,
            Integer day,
            List<Integer> newItemIds) {

        log.info("=== Day {} 순서 변경 시작 ===", day);
        log.info("사용자 지정 순서: {}", newItemIds);

        // 1. 검증
        if (newItemIds == null || newItemIds.isEmpty()) {
            throw new IllegalArgumentException("관광지 ID 리스트가 비어있습니다.");
        }

        // 2. 관광지 조회
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(newItemIds);

        if (spots.size() != newItemIds.size()) {
            throw new IllegalArgumentException("일부 관광지를 찾을 수 없습니다.");
        }

        // 3. 섬 개수 체크
        long islandCount = spots.stream()
                .filter(TouristSpot::isIsland)
                .count();

        if (islandCount > 1) {
            throw new IllegalArgumentException(
                    "하루에 섬은 1개만 방문 가능합니다. (현재: " + islandCount + "개)"
            );
        }

        if (islandCount == 1 && newItemIds.size() > 3) {
            throw new IllegalArgumentException(
                    "섬이 있는 날은 최대 3개 관광지만 가능합니다."
            );
        }

        // 4. 관광지를 사용자 지정 순서대로 정렬
        Map<Integer, TouristSpot> spotMap = spots.stream()
                .collect(Collectors.toMap(
                        TouristSpot::getSpotId,
                        spot -> spot
                ));

        List<TouristSpot> orderedSpots = newItemIds.stream()
                .map(spotMap::get)
                .collect(Collectors.toList());

        // 5. DB에서 일정 정보 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        if (itinerary == null) {
            throw new IllegalArgumentException("일정을 찾을 수 없습니다: " + itineraryId);
        }

        // 6. DB에서 해당 일차의 위치 정보 조회
        DailyLocation dayLocation = dailyLocationMapper.findByItineraryIdAndDay(
                itineraryId,
                day
        );

        if (dayLocation == null) {
            throw new IllegalArgumentException(
                    String.format("Day %d 위치 정보를 찾을 수 없습니다.", day));
        }

        log.info("Day {} 출발지: {} ({}, {})",
                day,
                dayLocation.getStartName(),
                dayLocation.getStartLat(),
                dayLocation.getStartLon());
        log.info("Day {} 도착지: {} ({}, {})",
                day,
                dayLocation.getEndName(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon());

        // 7. 사용자 순서 그대로 일정 생성 (TSP 사용 안 함!)
        DayScheduleDto reorderedSchedule = buildDayScheduleWithFixedOrder(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                orderedSpots,
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport()
        );

        log.info("=== Day {} 순서 변경 완료 ===", day);

        return reorderedSchedule;
    }

    // 사용자 지정 순서로 일정 생성
    private DayScheduleDto buildDayScheduleWithFixedOrder(
            int day,
            LocalDate date,
            List<TouristSpot> orderedSpots,
            double startLat,
            double startLon,
            double endLat,
            double endLon,
            String transport) {

        List<ScheduleItemDto> items = new ArrayList<>();
        LocalTime currentTime = LocalTime.of(9, 0);

        boolean hasIsland = false;
        double totalDistance = 0.0;
        int totalTravelDuration = 0;
        int totalStayDuration = 0;
        int totalCost = 0;

        double currentLat = startLat;
        double currentLon = startLon;

        // 사용자가 지정한 순서대로 처리
        for (int i = 0; i < orderedSpots.size(); i++) {
            TouristSpot spot = orderedSpots.get(i);

            if (spot.isIsland()) {
                hasIsland = true;
            }

            // 이동 정보 계산 (카카오 API)
            TravelInfoDto travelInfo = null;
            KakaoNaviService.RouteInfo routeInfo = kakaoNaviService.getRouteInfo(
                    currentLat,
                    currentLon,
                    spot.getLatitude(),
                    spot.getLongitude()
            );

            if (routeInfo != null) {
                currentTime = currentTime.plusMinutes(routeInfo.getDuration());
                totalTravelDuration += routeInfo.getDuration();
                totalDistance += routeInfo.getDistance();

                travelInfo = TravelInfoDto.builder()
                        .distance(routeInfo.getDistance())
                        .duration(routeInfo.getDuration())
                        .transportType(transport)
                        .build();
            }

            int duration = spot.getSpotDuration() > 0 ? spot.getSpotDuration() : 60;

            ScheduleItemDto item = ScheduleItemDto.builder()
                    .order(i)
                    .type("SPOT")
                    .itemId(spot.getSpotId())
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

            // 다음 이동을 위해 현재 위치 업데이트
            currentLat = spot.getLatitude();
            currentLon = spot.getLongitude();
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
                        orderedSpots.size(),
                        totalDistance,
                        hasIsland ? " (섬 포함)" : ""))
                .build();
    }

    public ItineraryRespDto getItinerary(Integer itineraryId) {

        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);

        if (itinerary == null) {
            throw new IllegalArgumentException("일정을 찾을 수 없습니다: " + itineraryId);
        }

        // ❗ 아직 DaySchedule은 DB에 없음 → 빈 리스트
        return ItineraryRespDto.builder()
                .itineraryId(itinerary.getItineraryId())
                .startDate(itinerary.getStartDate())
                .endDate(itinerary.getEndDate())
                .budget(itinerary.getBudget())
                .transport(itinerary.getTransport())
                .partyType(itinerary.getPartyType())
                .days(List.of())   // TODO
                .totalCost(itinerary.getTotalCost())
                .summary("일정 조회")
                .build();
    }

    // Day일정에서 관광지 삭제 및 재계산
    public DayScheduleDto deleteScheduleItem(
            Integer itineraryId,
            Integer day,
            Integer itemId) {

        log.info("=== Day {} 관광지 삭제 시작 ===", day);
        log.info("삭제할 관광지 ID: {}", itemId);

        // 1. DB에서 일정 정보 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        if (itinerary == null) {
            throw new IllegalArgumentException("일정을 찾을 수 없습니다: " + itineraryId);
        }

        // 2. DB에서 해당 일차의 위치 정보 조회
        DailyLocation dayLocation = dailyLocationMapper.findByItineraryIdAndDay(
                itineraryId,
                day
        );

        if (dayLocation == null) {
            throw new IllegalArgumentException(
                    String.format("Day %d 위치 정보를 찾을 수 없습니다.", day));
        }

        // 3. 현재 Day의 전체 관광지 ID 조회
        List<Integer> currentItemIds = getCurrentDayItemIds(itineraryId, day);

        // 4. 삭제할 아이템 제외
        List<Integer> remainingItemIds = currentItemIds.stream()
                .filter(id -> !Objects.equals(id, itemId))
                .collect(Collectors.toList());

        if (remainingItemIds.isEmpty()) {
            throw new IllegalArgumentException("최소 1개 이상의 관광지가 필요합니다.");
        }

        log.info("남은 관광지: {}", remainingItemIds);

        // 5. 관광지 조회
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(remainingItemIds);

        if (spots.size() != remainingItemIds.size()) {
            throw new IllegalArgumentException("일부 관광지를 찾을 수 없습니다.");
        }

        // 6. 사용자 순서대로 정렬
        Map<Integer, TouristSpot> spotMap = spots.stream()
                .collect(Collectors.toMap(
                        TouristSpot::getSpotId,
                        spot -> spot
                ));

        List<TouristSpot> orderedSpots = remainingItemIds.stream()
                .map(spotMap::get)
                .collect(Collectors.toList());

        // 7. 일정 재생성
        DayScheduleDto updatedSchedule = buildDayScheduleWithFixedOrder(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                orderedSpots,
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport()
        );

        log.info("=== Day {} 관광지 삭제 완료 ===", day);
        log.info("남은 관광지: {}개, 총 거리: {}km, 총 시간: {}분",
                orderedSpots.size(),
                updatedSchedule.getTotalDistance(),
                updatedSchedule.getTotalDuration());

        return updatedSchedule;
    }

    /**
     * Day 일정에서 관광지 체류 시간 변경 및 재계산
     */
    public DayScheduleDto updateItemDuration(
            Integer itineraryId,
            Integer day,
            Integer itemId,
            Integer newDuration) {

        log.info("=== Day {} 체류 시간 변경 시작 ===", day);
        log.info("관광지 ID: {}, 새 체류 시간: {}분", itemId, newDuration);

        // 1. 검증
        if (newDuration < 10 || newDuration > 240) {
            throw new IllegalArgumentException("체류 시간은 10분~4시간 사이여야 합니다.");
        }

        // 2. DB에서 일정 정보 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        if (itinerary == null) {
            throw new IllegalArgumentException("일정을 찾을 수 없습니다: " + itineraryId);
        }

        // 3. DB에서 해당 일차의 위치 정보 조회
        DailyLocation dayLocation = dailyLocationMapper.findByItineraryIdAndDay(
                itineraryId,
                day
        );

        if (dayLocation == null) {
            throw new IllegalArgumentException(
                    String.format("Day %d 위치 정보를 찾을 수 없습니다.", day));
        }

        log.info("Day {} 출발지: {} ({}, {})",
                day,
                dayLocation.getStartName(),
                dayLocation.getStartLat(),
                dayLocation.getStartLon());

        // 4. 현재 Day의 전체 관광지 ID 조회
        List<Integer> currentItemIds = getCurrentDayItemIds(itineraryId, day);

        // 5. 변경할 관광지가 포함되어 있는지 확인
        if (!currentItemIds.contains(itemId)) {
            throw new IllegalArgumentException("해당 관광지를 찾을 수 없습니다: " + itemId);
        }

        log.info("현재 관광지 순서: {}", currentItemIds);

        // 6. 관광지 조회
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(currentItemIds);

        if (spots.size() != currentItemIds.size()) {
            throw new IllegalArgumentException("일부 관광지를 찾을 수 없습니다.");
        }

        // 7. 사용자 순서대로 정렬
        Map<Integer, TouristSpot> spotMap = spots.stream()
                .collect(Collectors.toMap(
                        TouristSpot::getSpotId,
                        spot -> spot
                ));

        List<TouristSpot> orderedSpots = currentItemIds.stream()
                .map(spotMap::get)
                .collect(Collectors.toList());

        // 8. 변경된 체류 시간으로 일정 재생성
        DayScheduleDto updatedSchedule = buildDayScheduleWithCustomDuration(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                orderedSpots,
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport(),
                itemId,
                newDuration
        );

        log.info("=== Day {} 체류 시간 변경 완료 ===", day);
        log.info("총 거리: {}km, 총 시간: {}분",
                updatedSchedule.getTotalDistance(),
                updatedSchedule.getTotalDuration());

        return updatedSchedule;
    }

    /**
     * 현재 Day의 관광지 ID 목록 조회 (임시)
     * TODO: 실제로는 itinerary_items 테이블에서 조회해야 함
     */
    private List<Integer> getCurrentDayItemIds(Integer itineraryId, Integer day) {
        log.warn("getCurrentDayItemIds: 임시 데이터 사용 중 (DB 구현 필요)");
        return List.of(2, 3, 4);
    }

    /**
     * 특정 관광지의 체류 시간을 커스텀하여 일정 생성
     */
    private DayScheduleDto buildDayScheduleWithCustomDuration(
            int day,
            LocalDate date,
            List<TouristSpot> orderedSpots,
            double startLat,
            double startLon,
            double endLat,
            double endLon,
            String transport,
            Integer customItemId,
            Integer customDuration) {

        List<ScheduleItemDto> items = new ArrayList<>();
        LocalTime currentTime = LocalTime.of(9, 0);

        boolean hasIsland = false;
        double totalDistance = 0.0;
        int totalTravelDuration = 0;
        int totalStayDuration = 0;
        int totalCost = 0;

        double currentLat = startLat;
        double currentLon = startLon;

        // 사용자가 지정한 순서대로 처리
        for (int i = 0; i < orderedSpots.size(); i++) {
            TouristSpot spot = orderedSpots.get(i);

            if (spot.isIsland()) {
                hasIsland = true;
            }

            // 이동 정보 계산 (카카오 API)
            TravelInfoDto travelInfo = null;
            KakaoNaviService.RouteInfo routeInfo = kakaoNaviService.getRouteInfo(
                    currentLat,
                    currentLon,
                    spot.getLatitude(),
                    spot.getLongitude()
            );

            if (routeInfo != null) {
                currentTime = currentTime.plusMinutes(routeInfo.getDuration());
                totalTravelDuration += routeInfo.getDuration();
                totalDistance += routeInfo.getDistance();

                travelInfo = TravelInfoDto.builder()
                        .distance(routeInfo.getDistance())
                        .duration(routeInfo.getDuration())
                        .transportType(transport)
                        .build();
            }

            // ✅ 체류 시간 결정 (커스텀 vs 기본)
            int duration;
            int originalDuration = spot.getSpotDuration() > 0 ? spot.getSpotDuration() : 60;

            if (Objects.equals(spot.getSpotId(), customItemId)) {
                duration = customDuration;
                log.info("관광지 '{}' 체류 시간: {}분 → {}분 (사용자 조정)",
                        spot.getTitle(), originalDuration, customDuration);
            } else {
                duration = originalDuration;
            }

            ScheduleItemDto item = ScheduleItemDto.builder()
                    .order(i)
                    .type("SPOT")
                    .itemId(spot.getSpotId())
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

            // 다음 이동을 위해 현재 위치 업데이트
            currentLat = spot.getLatitude();
            currentLon = spot.getLongitude();
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
                        orderedSpots.size(),
                        totalDistance,
                        hasIsland ? " (섬 포함)" : ""))
                .build();
    }
}