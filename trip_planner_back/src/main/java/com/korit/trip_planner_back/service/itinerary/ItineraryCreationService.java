package com.korit.trip_planner_back.service.itinerary;

import com.korit.trip_planner_back.dto.ai.AIScheduleResponse;
import com.korit.trip_planner_back.dto.request.DailyLocationDto;
import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.request.ItinerarySaveDto;
import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.dto.response.ScheduleItemDto;
import com.korit.trip_planner_back.dto.response.TravelInfoDto;
import com.korit.trip_planner_back.dto.tsp.TspRequestDto;
import com.korit.trip_planner_back.dto.tsp.TspResponseDto;
import com.korit.trip_planner_back.entity.Itinerary;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;
import com.korit.trip_planner_back.service.KakaoNaviService;
import com.korit.trip_planner_back.service.TspService;
import com.korit.trip_planner_back.service.ai.AIResponseParser;
import com.korit.trip_planner_back.service.ai.GPTService;
import com.korit.trip_planner_back.service.ai.OrderDecisionService;
import com.korit.trip_planner_back.service.ai.PromptBuilder;
import com.korit.trip_planner_back.service.persistence.ItineraryPersistenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryCreationService {

    private final ItineraryValidator validator;
    private final TspService tspService;
    private final KakaoNaviService kakaoNaviService;
    private final ItineraryPersistenceService persistenceService;
    private final TouristSpotMapper touristSpotMapper;

    // AI 서비스들
    private final GPTService gptService;
    private final PromptBuilder promptBuilder;
    private final AIResponseParser aiResponseParser;
    private final OrderDecisionService orderDecisionService;

    // 일정 생성 (AI 중심)
    @Transactional
    public ItineraryRespDto create(ItineraryReqDto request) {
        // 1. 검증
        validator.validateCreateRequest(request);

        // 3. 관광지 조회
        List<TouristSpot> allSpots = touristSpotMapper.findAllByIds(request.getSpotIds());

        // 4. AI - 날짜별 그룹핑
        AIScheduleResponse aiResponse = callAIScheduler(allSpots, request);

        // 5. 각 Day별 처리 (TSP + AI 순서 결정)
        List<DayScheduleDto> days = processDays(aiResponse, request, allSpots);

        // 7. 최종 응답
        return buildResponseWithoutId(request, days);
    }

    private ItineraryRespDto buildResponseWithoutId(
            ItineraryReqDto request,
            List<DayScheduleDto> days) {

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
                .mapToInt(d -> d.getItems().size())
                .sum();

        return ItineraryRespDto.builder()
                .itineraryId(null)
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

    // AI 스케줄러 호출
    private AIScheduleResponse callAIScheduler(List<TouristSpot> spots, ItineraryReqDto request) {
        try {
            // 프롬프트 생성
            String prompt = promptBuilder.buildSchedulePrompt(
                    spots,
                    request.getDailyLocations(),
                    request.getTravelDays(),
                    request.getTransport()
            );

            // GPT 호출
            String gptResponse = gptService.callGptApi(prompt);

            // 파싱
            AIScheduleResponse aiResponse = aiResponseParser.parse(
                    gptResponse,
                    request.getTravelDays()
            );

            return aiResponse;

        } catch (Exception e) {
            throw new RuntimeException("AI 일정 생성 실패", e);
        }
    }

    // 각 Day 처리
    private List<DayScheduleDto> processDays(
            AIScheduleResponse aiResponse,
            ItineraryReqDto request,
            List<TouristSpot> allSpots) {

        List<DayScheduleDto> days = new ArrayList<>();

        // 관광지 Map
        Map<Integer, TouristSpot> spotMap = allSpots.stream()
                .collect(Collectors.toMap(TouristSpot::getSpotId, s -> s));

        for (AIScheduleResponse.DaySchedule aiDay : aiResponse.getDays()) {

            // SPOT만 추출
            List<Integer> spotIds = aiDay.getItems().stream()
                    .filter(item -> "SPOT".equals(item.getType()))
                    .map(AIScheduleResponse.ScheduleItem::getSpotId)
                    .collect(Collectors.toList());

            if (spotIds.isEmpty()) {
                log.warn("Day {}에 관광지 없음 - 스킵", aiDay.getDay());
                continue;
            }

            DailyLocationDto dayLoc = request.getDailyLocations().get(aiDay.getDay() - 1);

            // TSP 계산
            TspResponseDto tspResult = tspService.calculateOptimalRoute(
                    TspRequestDto.builder()
                            .spotIds(spotIds)
                            .startLat(dayLoc.getStartLat())
                            .startLon(dayLoc.getStartLon())
                            .endLat(dayLoc.getEndLat())
                            .endLon(dayLoc.getEndLon())
                            .transportType(request.getTransport())
                            .build()
            );

            // AI vs TSP 순서 결정
            List<Integer> finalOrder = orderDecisionService.decide(
                    aiDay,
                    tspResult,
                    spotMap,
                    dayLoc.getStartLat(), dayLoc.getStartLon(),
                    dayLoc.getEndLat(), dayLoc.getEndLon()
            );

            // 최종 순서로 관광지 정렬
            List<TouristSpot> orderedSpots = finalOrder.stream()
                    .map(spotMap::get)
                    .collect(Collectors.toList());

            // 관광지만으로 일정 생성
            DayScheduleDto daySchedule = buildDaySchedule(
                    aiDay.getDay(),
                    request.getStartDate().plusDays(aiDay.getDay() - 1),
                    orderedSpots,
                    dayLoc.getStartLat(),
                    dayLoc.getStartLon(),
                    dayLoc.getEndLat(),
                    dayLoc.getEndLon(),
                    request.getTransport()
            );

            days.add(daySchedule);
        }

        return days;
    }

    // Day 일정 생성 (관광지만)
    private DayScheduleDto buildDaySchedule(
            int day,
            java.time.LocalDate date,
            List<TouristSpot> orderedSpots,
            double startLat, double startLon,
            double endLat, double endLon,
            String transport) {

        List<ScheduleItemDto> items = new ArrayList<>();
        LocalTime currentTime = LocalTime.of(9, 0);

        double currentLat = startLat;
        double currentLon = startLon;
        int order = 0;

        for (TouristSpot spot : orderedSpots) {

            // 이동 시간 계산
            KakaoNaviService.RouteInfo route = kakaoNaviService.getRouteInfo(
                    currentLat, currentLon,
                    spot.getLatitude(), spot.getLongitude()
            );

            TravelInfoDto travelInfo = null;
            if (route != null) {
                currentTime = currentTime.plusMinutes(route.getDuration());
                travelInfo = TravelInfoDto.builder()
                        .distance(route.getDistance())
                        .duration(route.getDuration())
                        .transportType(transport)
                        .build();
            }

            // 관광지 추가
            int duration = spot.getSpotDuration() > 0 ? spot.getSpotDuration() : 60;

            ScheduleItemDto spotItem = ScheduleItemDto.builder()
                    .order(order++)
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
                    .build();

            items.add(spotItem);
            currentTime = currentTime.plusMinutes(duration);

            log.info("  ├─ {}: {} ~ {}", spot.getTitle(),
                    spotItem.getArrivalTime(), spotItem.getDepartureTime());

            currentLat = spot.getLatitude();
            currentLon = spot.getLongitude();
        }

        // 최종 일정 생성
        DayScheduleDto result = DayScheduleDto.builder()
                .day(day)
                .date(date)
                .startTime(LocalTime.of(9, 0))
                .endTime(currentTime)
                .items(items)
                .startLat(startLat)
                .startLon(startLon)
                .endLat(endLat)
                .endLon(endLon)
                .build();

        result.calculateTotals();

        log.info("=== Day {} 일정 생성 완료: {} ~ {} ===",
                day, result.getStartTime(), result.getEndTime());

        return result;
    }

    // 최종 응답 생성
    private ItineraryRespDto buildResponse(
            Itinerary itinerary,
            ItineraryReqDto request,
            List<DayScheduleDto> days) {

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
                .mapToInt(d -> d.getItems().size())
                .sum();

        return ItineraryRespDto.builder()
                .itineraryId(itinerary.getItineraryId())
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

    // 일정 저장 (DB)
    @Transactional
    public ItineraryRespDto save(ItinerarySaveDto request) {
        // 1. 검증
        validator.validateSaveRequest(request);

        // 2. ItinerarySaveDto → ItineraryReqDto 변환
        ItineraryReqDto reqDto = ItineraryReqDto.builder()
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .transport(request.getTransport())
                .partyType(request.getPartyType())
                .dailyLocations(request.getDailyLocations())
                .build();

        // 3. Itinerary 엔티티 생성 및 저장
        Itinerary itinerary = persistenceService.saveItinerary(reqDto);

        // 4. DailyLocation 저장
        persistenceService.saveDailyLocations(itinerary.getItineraryId(), request.getDailyLocations());

        // 5. Day별 일정 저장
        persistenceService.saveDaySchedules(itinerary.getItineraryId(), request.getDays());

        // 6. 저장된 일정에 itineraryId 추가
        List<DayScheduleDto> savedDays = request.getDays();

        // 7. 최종 응답 생성
        ItineraryRespDto response = buildResponseForSave(itinerary, request, savedDays);

        log.info("=== 일정 저장 완료: ID={}, {}일 ===",
                itinerary.getItineraryId(), savedDays.size());

        return response;
    }

    // 저장 응답 생성 (ItinerarySaveDto용)
    private ItineraryRespDto buildResponseForSave(
            Itinerary itinerary,
            ItinerarySaveDto request,
            List<DayScheduleDto> days) {

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
                .mapToInt(d -> d.getItems().size())
                .sum();

        return ItineraryRespDto.builder()
                .itineraryId(itinerary.getItineraryId())
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

    // 최종 응답 생성 (ItinerarySaveDto용 오버로드)
    private ItineraryRespDto buildResponse(
            Itinerary itinerary,
            ItinerarySaveDto request,
            List<DayScheduleDto> days) {

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
                .mapToInt(d -> d.getItems().size())
                .sum();

        return ItineraryRespDto.builder()
                .itineraryId(itinerary.getItineraryId())
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
}