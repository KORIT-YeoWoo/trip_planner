package com.korit.trip_planner_back.service.ai;

import com.korit.trip_planner_back.dto.ai.AIScheduleResponse;
import com.korit.trip_planner_back.dto.tsp.TspResponseDto;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.service.KakaoNaviService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderDecisionService {

    private final KakaoNaviService kakaoNaviService;

    private static final double TOLERANCE_PERCENT = 15.0;  // 15% 허용

    // AI 순서 vs TSP 순서 결정
    public List<Integer> decide(
            AIScheduleResponse.DaySchedule aiDay,
            TspResponseDto tspResult,
            Map<Integer, TouristSpot> spots,
            double startLat, double startLon,
            double endLat, double endLon) {

        // 1. AI가 특별한 이유를 제시한 관광지 확인
        Map<Integer, String> specialReasons = aiDay.getItems().stream()
                .filter(item -> "SPOT".equals(item.getType()))
                .filter(item -> item.getReason() != null && !item.getReason().isBlank())
                .collect(Collectors.toMap(
                        AIScheduleResponse.ScheduleItem::getSpotId,
                        AIScheduleResponse.ScheduleItem::getReason
                ));

        if (specialReasons.isEmpty()) {
            // AI 특별 이유 없음 → TSP 순서 사용
            log.info("Day {} - TSP 순서 채택 (AI 특별 이유 없음)", aiDay.getDay());
            return tspResult.getOptimizedSpotIds();
        }

        // 2. AI 순서 추출
        List<Integer> aiOrder = aiDay.getItems().stream()
                .filter(item -> "SPOT".equals(item.getType()))
                .map(AIScheduleResponse.ScheduleItem::getSpotId)
                .collect(Collectors.toList());

        // 3. AI 순서 거리 계산
        double aiDistance = calculateTotalDistance(aiOrder, spots, startLat, startLon, endLat, endLon);
        double tspDistance = tspResult.getTotalActualDistance();

        // 4. 거리 차이 비교
        double diffPercent = ((aiDistance - tspDistance) / tspDistance) * 100;

        if (diffPercent <= TOLERANCE_PERCENT) {
            return aiOrder;
        } else {
            // 차이 15% 초과 → TSP 순서 사용
            return tspResult.getOptimizedSpotIds();
        }
    }

    // 총 이동 거리 계산
    private double calculateTotalDistance(
            List<Integer> spotIds,
            Map<Integer, TouristSpot> spots,
            double startLat, double startLon,
            double endLat, double endLon) {

        double totalDistance = 0.0;
        double currentLat = startLat;
        double currentLon = startLon;

        for (Integer spotId : spotIds) {
            TouristSpot spot = spots.get(spotId);

            KakaoNaviService.RouteInfo route = kakaoNaviService.getRouteInfo(
                    currentLat, currentLon,
                    spot.getLatitude(), spot.getLongitude()
            );

            if (route != null) {
                totalDistance += route.getDistance();
            }

            currentLat = spot.getLatitude();
            currentLon = spot.getLongitude();
        }

        // 마지막 관광지 → 도착지
        KakaoNaviService.RouteInfo lastRoute = kakaoNaviService.getRouteInfo(
                currentLat, currentLon,
                endLat, endLon
        );

        if (lastRoute != null) {
            totalDistance += lastRoute.getDistance();
        }

        return totalDistance;
    }
}