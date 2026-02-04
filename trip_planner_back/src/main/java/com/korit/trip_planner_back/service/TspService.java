package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.algorithm.TspAlgorithm;
import com.korit.trip_planner_back.dto.tsp.RouteSegmentDto;
import com.korit.trip_planner_back.dto.tsp.TspRequestDto;
import com.korit.trip_planner_back.dto.tsp.TspResponseDto;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TspService {

    private final TouristSpotMapper touristSpotMapper;

    private final KakaoNaviService kakaoNaviService;

    public TspResponseDto calculateOptimalRoute(TspRequestDto request) {
        // 1. 요청 검증
        request.validate();

        if (request.getSpotIds().size() == 1) {
            return handleSingleSpot(request);
        }
        
        // 2. DB에서 관광지 조회
        List<TouristSpot> spots = touristSpotMapper.findAllByIds(request.getSpotIds());

        // 검증: 요청한 ID 개수와 조회된 관광지 개수 일치 확인
        if (spots.size() != request.getSpotIds().size()) {
            throw new IllegalArgumentException(
                    String.format("일부 관광지를 찾을 수 없습니다. (요청: %d개, 조회: %d개)",
                            request.getSpotIds().size(), spots.size())
            );
        }

        // 3. 도착지 처리 (없으면 출발지로 설정)
        double endLat = request.hasEndPoint() ? request.getEndLat() : request.getStartLat();
        double endLon = request.hasEndPoint() ? request.getEndLon() : request.getStartLon();

        // 4. TSP 알고리즘 실행
        TspAlgorithm.TspResult tspResult = TspAlgorithm.optimize(
                spots,
                request.getStartLat(),
                request.getStartLon(),
                endLat,
                endLon
        );

        // 5. 응답 DTO 생성
        TspResponseDto response = buildResponse(request, tspResult);

        // 6. 카카오 네비 API로 실제 거리/시간 계산
        enrichWithKakaoApi(response, request);

        return response;
    }

    private TspResponseDto handleSingleSpot(TspRequestDto request) {
        Integer spotId = request.getSpotIds().get(0);

        // 시작점 → 관광지 → 도착점 거리만 계산
        TouristSpot spot = touristSpotMapper.findById(spotId);

        // 시작점 → 관광지
        KakaoNaviService.RouteInfo toSpot = kakaoNaviService.getRouteInfo(
                request.getStartLat(), request.getStartLon(),
                spot.getLatitude(), spot.getLongitude()
        );

        double totalDistance = toSpot != null ? toSpot.getDistance() : 0.0;
        int totalDuration = toSpot != null ? toSpot.getDuration() : 0;

        // 관광지 → 도착점
        if (request.hasEndPoint()) {
            KakaoNaviService.RouteInfo toEnd = kakaoNaviService.getRouteInfo(
                    spot.getLatitude(), spot.getLongitude(),
                    request.getEndLat(), request.getEndLon()
            );

            if (toEnd != null) {
                totalDistance += toEnd.getDistance();
                totalDuration += toEnd.getDuration();
            }
        }

        return TspResponseDto.builder()
                .optimizedSpotIds(Collections.singletonList(spotId))
                .totalActualDistance(totalDistance)
                .totalDuration(totalDuration)
                .build();
    }

    private TspResponseDto buildResponse(TspRequestDto request, TspAlgorithm.TspResult tspResult) {
        List<TouristSpot> route = tspResult.getRoute();

        // 최적화된 관광지 ID 순서
        List<Integer> optimizedSpotIds = route.stream()
                .map(spot -> (int) spot.getSpotId())
                .collect(Collectors.toList());

        // 경로 구간 정보 생성
        List<RouteSegmentDto> routeSegments = buildRouteSegments(
                request,
                route
        );

        // LocationInfo 생성
        TspResponseDto.LocationInfo startPoint = TspResponseDto.LocationInfo.builder()
                .name(request.getStartName() != null ? request.getStartName() : "출발지")
                .lat(request.getStartLat())
                .lon(request.getStartLon())
                .build();

        TspResponseDto.LocationInfo endPoint = null;
        if (request.hasEndPoint()) {
            endPoint = TspResponseDto.LocationInfo.builder()
                    .name(request.getEndName() != null ? request.getEndName() : "도착지")
                    .lat(request.getEndLat())
                    .lon(request.getEndLon())
                    .build();
        }

        // 응답 DTO 구성
        return TspResponseDto.builder()
                .optimizedSpotIds(optimizedSpotIds)
                .routeSegments(routeSegments)
                .totalStraightDistance(tspResult.getOptimizedDistance())
                .totalActualDistance(null)  // 카카오 API는 나중에
                .totalDuration(null)         // 카카오 API는 나중에
                .algorithm("Greedy + 2-Opt")
                .improvementRate(tspResult.getImprovementRate())
                .transportType(request.getTransportType())
                .startPoint(startPoint)
                .endPoint(endPoint)
                .calculationTime(tspResult.getCalculationTime())
                .spotCount(route.size())
                .build();
    }

    private List<RouteSegmentDto> buildRouteSegments(TspRequestDto request, List<TouristSpot> route) {
        List<RouteSegmentDto> segments = new ArrayList<>();

        double currentLat = request.getStartLat();
        double currentLon = request.getStartLon();
        String currentName = request.getStartName() != null ? request.getStartName() : "출발지";
        int currentSpotId = 0;

        // 출발지 → 관광지들
        for (int i = 0; i < route.size(); i++) {
            TouristSpot nextSpot = route.get(i);

            RouteSegmentDto segment = RouteSegmentDto.builder()
                    .fromSpotId(currentSpotId)
                    .fromSpotName(currentName)
                    .fromLat(currentLat)
                    .fromLon(currentLon)
                    .toSpotId(nextSpot.getSpotId())
                    .toSpotName(nextSpot.getTitle())
                    .toLat(nextSpot.getLatitude())
                    .toLon(nextSpot.getLongitude())
                    .straightDistance(calculateDistance(
                            currentLat, currentLon,
                            nextSpot.getLatitude(), nextSpot.getLongitude()
                    ))
                    .actualDistance(null)  // 카카오 API는 나중에
                    .duration(null)         // 카카오 API는 나중에
                    .order(i)
                    .transportType(request.getTransportType())
                    .isIslandSegment(nextSpot.isIsland())  // 섬 여부 설정
                    .build();

            segments.add(segment);

            currentLat = nextSpot.getLatitude();
            currentLon = nextSpot.getLongitude();
            currentName = nextSpot.getTitle();
            currentSpotId = nextSpot.getSpotId();
        }

        // 마지막 관광지 → 도착지
        double endLat = request.hasEndPoint() ? request.getEndLat() : request.getStartLat();
        double endLon = request.hasEndPoint() ? request.getEndLon() : request.getStartLon();
        String endName = request.hasEndPoint() && request.getEndName() != null
                ? request.getEndName()
                : "도착지";

        RouteSegmentDto lastSegment = RouteSegmentDto.builder()
                .fromSpotId(currentSpotId)
                .fromSpotName(currentName)
                .fromLat(currentLat)
                .fromLon(currentLon)
                .toSpotId(0)
                .toSpotName(endName)
                .toLat(endLat)
                .toLon(endLon)
                .straightDistance(calculateDistance(currentLat, currentLon, endLat, endLon))
                .actualDistance(null)
                .duration(null)
                .order(route.size())
                .transportType(request.getTransportType())
                .isIslandSegment(false)
                .build();

        segments.add(lastSegment);

        return segments;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // HaversineDistance를 직접 호출
        return com.korit.trip_planner_back.algorithm.HaversineDistance.calculate(
                lat1, lon1, lat2, lon2
        );
    }

    private void enrichWithKakaoApi(TspResponseDto response, TspRequestDto request) {
        List<RouteSegmentDto> segments = response.getRouteSegments();

        double totalActualDistance = 0.0;
        int totalDuration = 0;
        int successCount = 0;
        int failCount = 0;

        for (RouteSegmentDto segment : segments) {
            try {
                KakaoNaviService.RouteInfo routeInfo = kakaoNaviService.getRouteInfo(
                        segment.getFromLat(),
                        segment.getFromLon(),
                        segment.getToLat(),
                        segment.getToLon()
                );

                // null 체크 (이미 fallback 처리됨)
                if (routeInfo != null) {
                    segment.setActualDistance(routeInfo.getDistance());
                    segment.setDuration(routeInfo.getDuration());

                    totalActualDistance += routeInfo.getDistance();
                    totalDuration += routeInfo.getDuration();
                    successCount++;
                } else {
                    // 이론상 발생 안 함 (fallback 있음)
                    failCount++;
                }

                Thread.sleep(100);

            } catch (Exception e) {
                log.error("구간 {} 처리 중 오류: {}", segment.getOrder(), e.getMessage());
                failCount++;
            }
        }

        // 일부 실패해도 결과 반환
        if (totalActualDistance > 0) {
            response.setTotalActualDistance(totalActualDistance);
            response.setTotalDuration(totalDuration);
        } else {
            // 전부 실패해도 직선거리는 있음
            log.warn("Kakao API 전부 실패 - 직선거리만 사용");
        }
    }
}