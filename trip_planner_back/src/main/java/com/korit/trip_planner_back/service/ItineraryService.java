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
import com.korit.trip_planner_back.entity.*;
import com.korit.trip_planner_back.mapper.*;
import com.korit.trip_planner_back.security.PrincipalUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final ItineraryDayMapper itineraryDayMapper;
    private final ItineraryItemMapper itineraryItemMapper;

    @Transactional
    public ItineraryRespDto createItinerary(ItineraryReqDto request) {
        log.info("=== 일정 생성 시작 ===");

        // 1. 검증
        validateRequest(request);

        // 2. DB 저장 (itineraries)
        Itinerary itinerary = saveItinerary(request);
        log.info("일정 저장 완료: ID={}", itinerary.getItineraryId());

        // 3. DB 저장 (daily_locations)
        saveDailyLocations(itinerary.getItineraryId(), request.getDailyLocations());

        // 4. 관광지 조회
        List<TouristSpot> allSpots = touristSpotMapper.findAllByIds(request.getSpotIds());

        // 5. GPT 필터링 + 그룹핑
        DayDistributionDto distribution = gptService.filterAndGroupSpots(
                allSpots,
                request.getTravelDays(),
                request.getDailyLocations(),
                request.getTransport()
        );

        // 6. TSP 계산
        List<DayScheduleDto> days = calculateOptimalSchedules(request, distribution, allSpots);

        // 7. GPT 다듬기
        days = gptService.refineSchedule(days);

        // 8. ✅ DB 저장 (itinerary_days, itinerary_items)
        saveDaySchedules(itinerary.getItineraryId(), days);

        // 9. 최종 응답
        ItineraryRespDto response = buildFinalResponse(itinerary.getItineraryId(), request, days);

        return response;
    }

    // ✅ 추가: Day 일정 DB 저장
    private void saveDaySchedules(Integer itineraryId, List<DayScheduleDto> days) {
        for (DayScheduleDto dayDto : days) {
            // itinerary_days INSERT
            ItineraryDay day = ItineraryDay.builder()
                    .itineraryId(itineraryId)
                    .dayNumber(dayDto.getDay())
                    .date(dayDto.getDate())
                    .startTime(dayDto.getStartTime())
                    .endTime(dayDto.getEndTime())
                    .aiComment(dayDto.getSummary())
                    .build();

            itineraryDayMapper.insert(day);

            // itinerary_items INSERT
            for (ScheduleItemDto item : dayDto.getItems()) {
                ItineraryItem itemEntity = ItineraryItem.builder()
                        .itineraryId(itineraryId)
                        .day(dayDto.getDay())
                        .spotId(item.getSpotId())
                        .sequenceOrder(item.getOrder())
                        .arrivalTime(item.getArrivalTime())
                        .departureTime(item.getDepartureTime())
                        .duration(item.getDuration())
                        .originalDuration(item.getDuration())
                        .travelTime(item.getTravelFromPrevious() != null
                                ? item.getTravelFromPrevious().getDuration() : 0)
                        .travelDistance(item.getTravelFromPrevious() != null
                                ? item.getTravelFromPrevious().getDistance() : 0.0)
                        .cost(item.getCost())
                        .build();

                itineraryItemMapper.insert(itemEntity);
            }
        }

        log.info("일정 DB 저장 완료: {}일, 총 {}개 항목",
                days.size(),
                days.stream().mapToInt(d -> d.getItems().size()).sum());
    }

    // ✅ 수정: 일정 조회 (DB에서)
    public ItineraryRespDto getItinerary(Integer itineraryId) {
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        if (itinerary == null) {
            throw new IllegalArgumentException("일정을 찾을 수 없습니다: " + itineraryId);
        }

        // DB에서 days 조회
        List<ItineraryDay> dayEntities = itineraryDayMapper.findByItineraryId(itineraryId);
        List<DayScheduleDto> days = new ArrayList<>();

        for (ItineraryDay dayEntity : dayEntities) {
            // 해당 Day의 items 조회
            List<ItineraryItem> itemEntities = itineraryItemMapper.findByDayId(
                    itineraryId, dayEntity.getDayNumber());

            List<ScheduleItemDto> items = itemEntities.stream()
                    .map(this::toScheduleItemDto)
                    .collect(Collectors.toList());

            DayScheduleDto dayDto = DayScheduleDto.builder()
                    .day(dayEntity.getDayNumber())
                    .date(dayEntity.getDate())
                    .startTime(dayEntity.getStartTime())
                    .endTime(dayEntity.getEndTime())
                    .items(items)
                    .summary(dayEntity.getAiComment())
                    .build();

            dayDto.calculateTotals();

            days.add(dayDto);
        }

        log.info("=== 조회된 일정 ID={} 상세 응답 ===", itineraryId);
        log.info("총 일차 수: {}", days.size());

        days.forEach(day -> {
            log.info("Day {} - items: {}개 | totalDistance: {}km | totalDuration: {}분 | totalCost: {}원",
                    day.getDay(),
                    day.getItems() != null ? day.getItems().size() : 0,
                    day.getTotalDistance(),
                    day.getTotalDuration(),
                    day.getTotalCost()
            );
        });

        return ItineraryRespDto.builder()
                .itineraryId(itinerary.getItineraryId())
                .startDate(itinerary.getStartDate())
                .endDate(itinerary.getEndDate())
                .budget(itinerary.getBudget())
                .transport(itinerary.getTransport())
                .partyType(itinerary.getPartyType())
                .days(days)
                .totalCost(itinerary.getTotalCost())
                .build();
    }

    // ItineraryItem → ScheduleItemDto 변환
    private ScheduleItemDto toScheduleItemDto(ItineraryItem item) {
        TouristSpot spot = touristSpotMapper.findById(item.getSpotId());

        TravelInfoDto travelInfo = null;
        if (item.getTravelTime() != null && item.getTravelTime() > 0) {
            travelInfo = TravelInfoDto.builder()
                    .distance(item.getTravelDistance())
                    .duration(item.getTravelTime())
                    .transportType("CAR")
                    .build();
        }

        return ScheduleItemDto.builder()
                .order(item.getSequenceOrder())
                .type("SPOT")
                .spotId(item.getSpotId())
                .name(spot.getTitle())
                .category(spot.getCategory())
                .lat(spot.getLatitude())
                .lon(spot.getLongitude())
                .arrivalTime(item.getArrivalTime())
                .departureTime(item.getDepartureTime())
                .duration(item.getDuration())
                .cost(item.getCost())
                .isIsland(spot.isIsland())
                .travelFromPrevious(travelInfo)
                .build();
    }

    // ✅ 추가: 로그인 userId 가져오기
    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof PrincipalUser)) {
            // 개발 중에는 1 반환
            log.warn("로그인 정보 없음 - 테스트용 userId=1 사용");
            return 1;
        }

        PrincipalUser principal = (PrincipalUser) auth.getPrincipal();
        return principal.getUser().getUserId();
    }

    // ✅ 수정: N+1 쿼리 제거
    private List<DayScheduleDto> calculateOptimalSchedules(
            ItineraryReqDto request,
            DayDistributionDto distribution,
            List<TouristSpot> allSpots) {

        List<DayScheduleDto> days = new ArrayList<>();
        Map<Integer, List<Integer>> dayGroups = distribution.getDayGroups();

        // ✅ 한 번에 조회한 관광지를 Map으로
        Map<Integer, TouristSpot> spotMap = allSpots.stream()
                .collect(Collectors.toMap(TouristSpot::getSpotId, s -> s));

        for (Map.Entry<Integer, List<Integer>> entry : dayGroups.entrySet()) {
            int day = entry.getKey();
            List<Integer> daySpotIds = entry.getValue();

            if (daySpotIds.isEmpty()) continue;

            // ✅ Map에서 가져오기 (DB 조회 X)
            List<TouristSpot> daySpots = daySpotIds.stream()
                    .map(spotMap::get)
                    .collect(Collectors.toList());

            if (daySpotIds.size() == 1) {
                days.add(buildSingleSpotSchedule(
                        day,
                        request.getStartDate().plusDays(day - 1),
                        daySpots.get(0),
                        request
                ));
                continue;
            }

            LocationInfo start = getDayStartLocation(day, request);
            LocationInfo end = getDayEndLocation(day, request);

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

            days.add(buildDayScheduleFromTsp(
                    day,
                    request.getStartDate().plusDays(day - 1),
                    tspResult,
                    request,
                    spotMap
            ));
        }

        return days;
    }

    private Itinerary saveItinerary(ItineraryReqDto request) {
        Itinerary itinerary = Itinerary.builder()
                .userId(getCurrentUserId())  // ✅ 수정
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

    private void saveDailyLocations(Integer itineraryId, List<DailyLocationDto> locations) {
        for (DailyLocationDto locDto : locations) {
            dailyLocationMapper.insert(locDto.toEntity(itineraryId));
        }
    }

    private void validateRequest(ItineraryReqDto request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("여행 날짜를 입력해주세요.");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("시작일이 종료일보다 늦습니다.");
        }

        if (request.getSpotIds() == null || request.getSpotIds().size() < 2) {
            throw new IllegalArgumentException("최소 2개 이상의 관광지를 선택해주세요.");
        }

        if (!request.hasValidDailyLocations()) {
            throw new IllegalArgumentException("위치 정보가 올바르지 않습니다.");
        }
    }

    private DayScheduleDto buildSingleSpotSchedule(
            int day, LocalDate date, TouristSpot spot, ItineraryReqDto request) {

        LocalTime currentTime = LocalTime.of(9, 0);
        int duration = spot.getSpotDuration() > 0 ? spot.getSpotDuration() : 60;

        ScheduleItemDto item = ScheduleItemDto.builder()
                .order(0)
                .type("SPOT")
                .spotId(spot.getSpotId())
                .name(spot.getTitle())
                .category(spot.getCategory())
                .lat(spot.getLatitude())
                .lon(spot.getLongitude())
                .arrivalTime(currentTime)
                .duration(duration)
                .departureTime(currentTime.plusMinutes(duration))
                .cost(spot.getPrice())
                .isIsland(spot.isIsland())
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
                .build();
    }

    private DayScheduleDto buildDayScheduleFromTsp(
            int day, LocalDate date, TspResponseDto tspResult,
            ItineraryReqDto request, Map<Integer, TouristSpot> spotMap) {

        List<Integer> spotIds = tspResult.getOptimizedSpotIds();
        List<ScheduleItemDto> items = new ArrayList<>();
        LocalTime currentTime = LocalTime.of(9, 0);

        boolean hasIsland = false;
        double totalDistance = 0.0;
        int totalDuration = 0;
        int totalCost = 0;
        Integer fromSpotId = 0;

        for (int i = 0; i < spotIds.size(); i++) {
            TouristSpot spot = spotMap.get(spotIds.get(i));
            if (spot.isIsland()) hasIsland = true;

            TravelInfoDto travelInfo = null;
            if (tspResult.getRouteSegments() != null) {
                String key = fromSpotId + "-" + spotIds.get(i);
                var segment = tspResult.getRouteSegments().stream()
                        .filter(s -> key.equals(s.getFromSpotId() + "-" + s.getToSpotId()))
                        .findFirst()
                        .orElse(null);

                if (segment != null && segment.getActualDistance() != null) {
                    currentTime = currentTime.plusMinutes(segment.getDuration());
                    totalDuration += segment.getDuration();
                    totalDistance += segment.getActualDistance();

                    travelInfo = TravelInfoDto.builder()
                            .distance(segment.getActualDistance())
                            .duration(segment.getDuration())
                            .transportType(request.getTransport())
                            .build();
                }
            }

            int duration = spot.getSpotDuration() > 0 ? spot.getSpotDuration() : 60;

            items.add(ScheduleItemDto.builder()
                    .order(i)
                    .type("SPOT")
                    .spotId(spot.getSpotId())
                    .name(spot.getTitle())
                    .category(spot.getCategory())
                    .lat(spot.getLatitude())
                    .lon(spot.getLongitude())
                    .arrivalTime(currentTime)
                    .duration(duration)
                    .departureTime(currentTime.plusMinutes(duration))
                    .cost(spot.getPrice())
                    .isIsland(spot.isIsland())
                    .travelFromPrevious(travelInfo)
                    .build());

            totalCost += spot.getPrice();
            totalDuration += duration;
            currentTime = currentTime.plusMinutes(duration);
            fromSpotId = spot.getSpotId();
        }

        return DayScheduleDto.builder()
                .day(day)
                .date(date)
                .startTime(LocalTime.of(9, 0))
                .endTime(currentTime)
                .items(items)
                .totalDistance(totalDistance)
                .totalDuration(totalDuration)
                .totalCost(totalCost)
                .hasIsland(hasIsland)
                .build();
    }

    private LocationInfo getDayStartLocation(int day, ItineraryReqDto request) {
        DailyLocationDto loc = request.getDailyLocations().get(day - 1);
        return new LocationInfo(loc.getStartName(), loc.getStartLat(), loc.getStartLon());
    }

    private LocationInfo getDayEndLocation(int day, ItineraryReqDto request) {
        DailyLocationDto loc = request.getDailyLocations().get(day - 1);
        return new LocationInfo(loc.getEndName(), loc.getEndLat(), loc.getEndLon());
    }

    private ItineraryRespDto buildFinalResponse(Integer itineraryId, ItineraryReqDto request, List<DayScheduleDto> days) {
        double totalDistance = days.stream()
                .mapToDouble(d -> d.getTotalDistance() != null ? d.getTotalDistance() : 0.0).sum();
        int totalDuration = days.stream()
                .mapToInt(d -> d.getTotalDuration() != null ? d.getTotalDuration() : 0).sum();
        int totalCost = days.stream()
                .mapToInt(d -> d.getTotalCost() != null ? d.getTotalCost() : 0).sum();
        int totalSpots = days.stream()
                .mapToInt(d -> d.getItems() != null ? d.getItems().size() : 0).sum();

        return ItineraryRespDto.builder()
                .itineraryId(itineraryId)
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
                .build();
    }

    @Transactional
    public DayScheduleDto reorderDaySchedule(
            Integer itineraryId,
            Integer day,
            List<Integer> sptIds) {

        log.info("=== Day {} 순서 변경 시작 ===", day);

        // 1. 검증
        if (sptIds == null || sptIds.isEmpty()) {
            throw new IllegalArgumentException("관광지 ID 리스트가 비어있습니다.");
        }

        // 2. 관광지 조회
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(sptIds);
        if (spots.size() != sptIds.size()) {
            throw new IllegalArgumentException("일부 관광지를 찾을 수 없습니다.");
        }

        // 3. 섬 개수 체크
        long islandCount = spots.stream().filter(TouristSpot::isIsland).count();
        if (islandCount > 1) {
            throw new IllegalArgumentException("하루에 섬은 1개만 방문 가능합니다.");
        }
        if (islandCount == 1 && sptIds.size() > 3) {
            throw new IllegalArgumentException("섬이 있는 날은 최대 3개 관광지만 가능합니다.");
        }

        // 4. DB 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        DailyLocation dayLocation = dailyLocationMapper.findByItineraryIdAndDay(itineraryId, day);

        if (itinerary == null || dayLocation == null) {
            throw new IllegalArgumentException("일정 정보를 찾을 수 없습니다.");
        }

        // 5. 사용자 순서대로 정렬
        Map<Integer, TouristSpot> spotMap = spots.stream()
                .collect(Collectors.toMap(TouristSpot::getSpotId, s -> s));
        List<TouristSpot> orderedSpots = sptIds.stream()
                .map(spotMap::get)
                .collect(Collectors.toList());

        // 6. 일정 재생성
        DayScheduleDto newSchedule = buildScheduleWithKakao(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                orderedSpots,
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport()
        );

        // 7. DB 업데이트
        updateDayScheduleInDb(itineraryId, day, newSchedule);

        log.info("=== Day {} 순서 변경 완료 ===", day);
        return newSchedule;
    }
    @Transactional
    public DayScheduleDto deleteScheduleItem(
            Integer itineraryId,
            Integer day,
            Integer spotId) {

        log.info("=== Day {} 관광지 삭제 시작: spotId={} ===", day, spotId);

        // 1. 현재 day의 모든 아이템을 DB에서 조회 (삭제 전 상태)
        List<ItineraryItem> currentItems = itineraryItemMapper.findByDayId(itineraryId, day);

        log.info("삭제 전 아이템 수: {}", currentItems.size());

        // 2. 메모리상에서 삭제 대상 제외 (DB에는 아직 손대지 않음)
        List<ItineraryItem> remainingItems = currentItems.stream()
                .filter(item -> !item.getSpotId().equals(spotId))
                .sorted(Comparator.comparingInt(ItineraryItem::getSequenceOrder))
                .collect(Collectors.toList());

        if (remainingItems.isEmpty()) {
            throw new IllegalArgumentException("최소 1개 이상의 관광지가 필요합니다.");
        }

        if (remainingItems.size() == currentItems.size()) {
            log.warn("삭제 대상 spotId={} 를 찾지 못함 (이미 삭제됐거나 잘못된 ID)", spotId);
            throw new IllegalArgumentException("삭제할 아이템을 찾을 수 없습니다.");
        }

        log.info("삭제 후 남은 아이템 수: {}", remainingItems.size());

        // 3. 남은 spotId 목록 추출
        List<Integer> remainingSpotIds = remainingItems.stream()
                .map(ItineraryItem::getSpotId)
                .collect(Collectors.toList());

        // 4. 관광지 정보 재조회 (필요한 필드만)
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(remainingSpotIds);

        if (spots.size() != remainingSpotIds.size()) {
            throw new IllegalArgumentException("일부 관광지 정보를 찾을 수 없습니다.");
        }

        // 5. 일정 기본 정보 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        DailyLocation dayLocation = dailyLocationMapper.findByItineraryIdAndDay(itineraryId, day);

        if (itinerary == null || dayLocation == null) {
            throw new IllegalArgumentException("일정 또는 위치 정보를 찾을 수 없습니다.");
        }

        // 6. Kakao Navigation으로 새 일정 계산
        //    → buildScheduleWithKakao가 spots 리스트의 순서를 존중하도록 가정
        DayScheduleDto newSchedule = buildScheduleWithKakao(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                spots,  // 순서가 중요하므로 remainingSpotIds 순서대로 정렬된 spots여야 함
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport()
        );

        // 7. DB 일괄 업데이트 (기존 전체 삭제 → 새로 삽입)
        updateDayScheduleInDb(itineraryId, day, newSchedule);

        log.info("삭제 및 재정렬 완료 → 최종 아이템 수: {}", newSchedule.getItems().size());

        return newSchedule;
    }

    @Transactional
    public DayScheduleDto updateItemDuration(
            Integer itineraryId,
            Integer day,
            Integer spotId,
            Integer newDuration) {

        log.info("=== Day {} 체류 시간 변경: {} → {}분 ===", day, spotId, newDuration);

        // 1. 검증
        if (newDuration < 10 || newDuration > 240) {
            throw new IllegalArgumentException("체류 시간은 10분~4시간 사이여야 합니다.");
        }

        // 2. DB 조회
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);
        DailyLocation dayLocation = dailyLocationMapper.findByItineraryIdAndDay(itineraryId, day);
        List<ItineraryItem> items = itineraryItemMapper.findByDayId(itineraryId, day);

        if (itinerary == null || dayLocation == null || items.isEmpty()) {
            throw new IllegalArgumentException("일정 정보를 찾을 수 없습니다.");
        }

        // 3. 관광지 조회
        List<Integer> spotIds = items.stream()
                .map(ItineraryItem::getSpotId)
                .collect(Collectors.toList());
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(spotIds);

        // 4. 사용자 순서대로 정렬
        Map<Integer, TouristSpot> spotMap = spots.stream()
                .collect(Collectors.toMap(TouristSpot::getSpotId, s -> s));
        List<TouristSpot> orderedSpots = spotIds.stream()
                .map(spotMap::get)
                .collect(Collectors.toList());

        // 5. 체류 시간 커스텀 적용
        Map<Integer, Integer> currentDurations = items.stream()
                .collect(Collectors.toMap(ItineraryItem::getSpotId, ItineraryItem::getDuration));

        for (TouristSpot spot : orderedSpots) {
            if (Objects.equals(spot.getSpotId(), spotId)) {
                spot.setSpotDuration(newDuration);  // 변경 대상
            } else {
                spot.setSpotDuration(currentDurations.getOrDefault(spot.getSpotId(), spot.getSpotDuration()));  // ← 기존 DB duration 반영!
            }
        }

        // 6. 일정 재생성
        DayScheduleDto newSchedule = buildScheduleWithKakao(
                day,
                itinerary.getStartDate().plusDays(day - 1),
                orderedSpots,
                dayLocation.getStartLat(),
                dayLocation.getStartLon(),
                dayLocation.getEndLat(),
                dayLocation.getEndLon(),
                itinerary.getTransport()
        );

        // 7. DB 업데이트
        updateDayScheduleInDb(itineraryId, day, newSchedule);

        log.info("=== Day {} 체류 시간 변경 완료 ===", day);
        return newSchedule;
    }

    private DayScheduleDto buildScheduleWithKakao(
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
        int totalDuration = 0;
        int totalCost = 0;

        double currentLat = startLat;
        double currentLon = startLon;

        for (int i = 0; i < orderedSpots.size(); i++) {
            TouristSpot spot = orderedSpots.get(i);
            if (spot.isIsland()) hasIsland = true;

            // Kakao API 호출
            TravelInfoDto travelInfo = null;
            KakaoNaviService.RouteInfo routeInfo = kakaoNaviService.getRouteInfo(
                    currentLat, currentLon,
                    spot.getLatitude(), spot.getLongitude()
            );

            if (routeInfo != null) {
                currentTime = currentTime.plusMinutes(routeInfo.getDuration());
                totalDuration += routeInfo.getDuration();
                totalDistance += routeInfo.getDistance();

                travelInfo = TravelInfoDto.builder()
                        .distance(routeInfo.getDistance())
                        .duration(routeInfo.getDuration())
                        .transportType(transport)
                        .build();
            }

            int duration = spot.getSpotDuration() > 0 ? spot.getSpotDuration() : 60;

            items.add(ScheduleItemDto.builder()
                    .order(i)
                    .type("SPOT")
                    .spotId(spot.getSpotId())
                    .name(spot.getTitle())
                    .category(spot.getCategory())
                    .lat(spot.getLatitude())
                    .lon(spot.getLongitude())
                    .arrivalTime(currentTime)
                    .duration(duration)
                    .departureTime(currentTime.plusMinutes(duration))
                    .cost(spot.getPrice())
                    .isIsland(spot.isIsland())
                    .travelFromPrevious(travelInfo)
                    .build());

            totalCost += spot.getPrice();
            totalDuration += duration;
            currentTime = currentTime.plusMinutes(duration);

            currentLat = spot.getLatitude();
            currentLon = spot.getLongitude();
        }

        DayScheduleDto result = DayScheduleDto.builder()
                .day(day)
                .date(date)
                .startTime(LocalTime.of(9, 0))
                .endTime(currentTime)
                .items(items)
                .hasIsland(hasIsland)
                .build();

        result.calculateTotals();
        return result;
    }

    private void updateDayScheduleInDb(Integer itineraryId, Integer day, DayScheduleDto schedule) {
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
        for (ScheduleItemDto item : schedule.getItems()) {
            ItineraryItem itemEntity = ItineraryItem.builder()
                    .itineraryId(itineraryId)
                    .day(day)
                    .spotId(item.getSpotId())
                    .sequenceOrder(item.getOrder())
                    .arrivalTime(item.getArrivalTime())
                    .departureTime(item.getDepartureTime())
                    .duration(item.getDuration())
                    .originalDuration(item.getDuration())
                    .travelTime(item.getTravelFromPrevious() != null
                            ? item.getTravelFromPrevious().getDuration() : 0)
                    .travelDistance(item.getTravelFromPrevious() != null
                            ? item.getTravelFromPrevious().getDistance() : 0.0)
                    .cost(item.getCost())
                    .build();

            itineraryItemMapper.insert(itemEntity);
        }
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

}