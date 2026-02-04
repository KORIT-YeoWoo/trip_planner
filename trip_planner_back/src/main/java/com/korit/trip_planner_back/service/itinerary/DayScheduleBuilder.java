package com.korit.trip_planner_back.service.itinerary;

import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ScheduleItemDto;
import com.korit.trip_planner_back.dto.response.TravelInfoDto;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.service.KakaoNaviService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DayScheduleBuilder {

    private final KakaoNaviService kakaoNaviService;

    // 관광지 순서대로 Day 일정 생성 (Kakao API 사용)
    public DayScheduleDto build(
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
}