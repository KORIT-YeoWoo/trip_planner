package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.dto.response.TravelStatsDTO;
import com.korit.trip_planner_back.dto.response.TravelStyleDTO;
import com.korit.trip_planner_back.entity.Itinerary;
import com.korit.trip_planner_back.entity.ItineraryItem;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.enums.TravelType;
import com.korit.trip_planner_back.mapper.ItineraryItemMapper;
import com.korit.trip_planner_back.mapper.ItineraryMapper;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelStyleService {

    private final ItineraryMapper itineraryMapper;
    private final ItineraryItemMapper itineraryItemMapper;
    private final TouristSpotMapper touristSpotMapper;

    /**
     * 여행 스타일 분석
     */
    public TravelStyleDTO analyzeTravelStyle(Integer userId) {
        log.info("=== 여행 스타일 분석 시작: userId={} ===", userId);

        // 1. 사용자의 모든 여행 조회
        List<Itinerary> trips = itineraryMapper.findByUserId(userId);

        // 2. 최소 3개 체크
        if (trips.size() < 3) {
            log.info("여행 데이터 부족: {}회 (최소 3회 필요)", trips.size());
            return TravelStyleDTO.builder()
                    .isAnalyzable(false)
                    .currentTripCount(trips.size())
                    .requiredTripCount(3)
                    .build();
        }

        // 3. 통계 계산
        TravelStatsDTO stats = calculateStats(trips);

        // 4. 3축 레벨 판정
        String moveLevel = determineMoveLevel(stats.getAvgDistancePerDay());
        String tourLevel = determineTourLevel(stats.getAvgTouristPerDay());
        String foodLevel = determineFoodLevel(
                stats.getAvgRestaurantPerDay(),
                stats.getAvgRestaurantPrice()
        );

        // 5. 타입 결정
        TravelType type = determineTravelType(moveLevel, tourLevel, foodLevel);

        log.info("분석 완료: {} (이동:{}, 관광:{}, 식사:{})",
                type.getDisplayName(), moveLevel, tourLevel, foodLevel);

        return TravelStyleDTO.builder()
                .isAnalyzable(true)
                .currentTripCount(trips.size())
                .requiredTripCount(3)
                .type(type)
                .typeName(type.getDisplayName())
                .typeDescription(type.getDescription())
                .stats(stats)
                .moveLevel(moveLevel)
                .tourLevel(tourLevel)
                .foodLevel(foodLevel)
                .preferredTags(null)  // 나중에 구현
                .build();
    }

    /**
     * 통계 계산
     */
    private TravelStatsDTO calculateStats(List<Itinerary> trips) {
        double totalDistance = 0;
        int totalDays = 0;
        double totalBudget = 0;
        int totalPlaces = 0;
        int totalRestaurants = 0;
        double totalRestaurantPrice = 0;

        for (Itinerary trip : trips) {
            // 여행 일수
            totalDays += trip.getTravelDays();
            totalBudget += trip.getBudget() != null ? trip.getBudget() : 0;

            // 해당 여행의 모든 아이템 조회
            List<ItineraryItem> items = itineraryItemMapper
                    .findByItineraryId(trip.getItineraryId());

            totalPlaces += items.size();

            // 이동 거리 합산
            for (ItineraryItem item : items) {
                if (item.getTravelDistance() != null) {
                    totalDistance += item.getTravelDistance();
                }
            }

            // 식당 타입 필터링 (SPOT 중 category가 '음식점'인 것)
            List<Integer> spotIds = items.stream()
                    .filter(item -> "SPOT".equals(item.getItemType()))
                    .map(ItineraryItem::getSpotId)
                    .collect(Collectors.toList());

            if (!spotIds.isEmpty()) {
                List<TouristSpot> spots = touristSpotMapper.findAllByIds(spotIds);

                // 식당 카운트 및 가격 합산
                for (TouristSpot spot : spots) {
                    if ("음식점".equals(spot.getCategory())) {
                        totalRestaurants++;
                        totalRestaurantPrice += spot.getPrice();
                    }
                }
            }
        }

        // 평균 계산
        double avgDistancePerDay = totalDays > 0 ? totalDistance / totalDays : 0;
        double avgTouristPerDay = totalDays > 0 ?
                (totalPlaces - totalRestaurants) / (double) totalDays : 0;
        double avgRestaurantPerDay = totalDays > 0 ?
                totalRestaurants / (double) totalDays : 0;
        double avgRestaurantPrice = totalRestaurants > 0 ?
                totalRestaurantPrice / totalRestaurants : 0;

        return TravelStatsDTO.builder()
                .totalTrips(trips.size())
                .totalDistance(totalDistance)
                .totalDays(totalDays)
                .totalBudget(totalBudget)
                .totalPlaces(totalPlaces)
                .avgDistancePerDay(avgDistancePerDay)
                .avgTouristPerDay(avgTouristPerDay)
                .avgRestaurantPerDay(avgRestaurantPerDay)
                .avgRestaurantPrice(avgRestaurantPrice)
                .build();
    }

    /**
     * 이동 레벨 판정
     */
    private String determineMoveLevel(double avgDistancePerDay) {
        if (avgDistancePerDay >= 90) return "HIGH";
        if (avgDistancePerDay >= 70) return "MEDIUM";
        return "LOW";
    }

    /**
     * 관광 레벨 판정
     */
    private String determineTourLevel(double avgTouristPerDay) {
        if (avgTouristPerDay >= 5) return "HIGH";
        if (avgTouristPerDay >= 3) return "MEDIUM";
        return "LOW";
    }

    /**
     * 식사 레벨 판정
     */
    private String determineFoodLevel(double avgRestaurantPerDay, double avgPrice) {
        if (avgRestaurantPerDay >= 2.5 && avgPrice >= 20000) {
            return "HIGH";
        }
        if (avgRestaurantPerDay < 2 || avgPrice < 15000) {
            return "LOW";
        }
        return "MEDIUM";
    }

    /**
     * 타입 결정 (9가지 케이스)
     */
    private TravelType determineTravelType(String move, String tour, String food) {
        // === HIGH 케이스 ===
        if ("HIGH".equals(move)) {
            if ("HIGH".equals(tour)) {
                if ("HIGH".equals(food)) return TravelType.INFLUENCER;      // H H H
                if ("MEDIUM".equals(food)) return TravelType.INFLUENCER;    // H H M
                if ("LOW".equals(food)) return TravelType.EXPLORER;         // H H L
            }
            if ("MEDIUM".equals(tour)) {
                if ("HIGH".equals(food)) return TravelType.FOODIE;          // H M H
                if ("MEDIUM".equals(food)) return TravelType.DRIVER;        // H M M (드라이브 중심)
                if ("LOW".equals(food)) return TravelType.DRIVER;           // H M L
            }
            if ("LOW".equals(tour)) {
                if ("HIGH".equals(food)) return TravelType.FOODIE;          // H L H
                if ("MEDIUM".equals(food)) return TravelType.DRIVER;        // H L M
                if ("LOW".equals(food)) return TravelType.DRIVER;           // H L L
            }
        }

        // === LOW 케이스 ===
        if ("LOW".equals(move)) {
            if ("HIGH".equals(tour)) {
                if ("HIGH".equals(food)) return TravelType.FLEX;            // L H H
                if ("MEDIUM".equals(food)) return TravelType.COST_EFFECTIVE; // L H M
                if ("LOW".equals(food)) return TravelType.COST_EFFECTIVE;   // L H L
            }
            if ("MEDIUM".equals(tour)) {
                if ("HIGH".equals(food)) return TravelType.VACATION;        // L M H
                if ("MEDIUM".equals(food)) return TravelType.HEALING;       // L M M (느긋함)
                if ("LOW".equals(food)) return TravelType.HEALING;          // L M L
            }
            if ("LOW".equals(tour)) {
                if ("HIGH".equals(food)) return TravelType.VACATION;        // L L H
                if ("MEDIUM".equals(food)) return TravelType.HEALING;       // L L M
                if ("LOW".equals(food)) return TravelType.HEALING;          // L L L
            }
        }

        // === MEDIUM 케이스 ===
        if ("MEDIUM".equals(move)) {
            if ("MEDIUM".equals(tour) && "MEDIUM".equals(food)) {
                return TravelType.BALANCE;  // M M M만 밸런스형
            }

            // 나머지 MEDIUM 포함 케이스들은 가장 높은 축으로 분류
            if ("HIGH".equals(tour)) return TravelType.COST_EFFECTIVE;  // M H * (관광 중심)
            if ("HIGH".equals(food)) return TravelType.VACATION;        // M * H (미식 중심)
            if ("LOW".equals(tour) && "LOW".equals(food)) return TravelType.HEALING; // M L L

            // 그 외 애매한 케이스
            return TravelType.BALANCE;
        }

        // 혹시 모를 예외
        return TravelType.BALANCE;
    }
}