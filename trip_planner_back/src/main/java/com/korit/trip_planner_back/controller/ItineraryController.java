package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.service.ItineraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/itinerary")
@Tag(name = "Itinerary", description = "일정 생성 API")
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/generate")
    @Operation(summary = "일정 생성", description = "여행 일정 자동 생성 (TSP 최적화)")
    public ResponseEntity<ItineraryRespDto> generateItinerary(
            @RequestBody ItineraryReqDto request) {

            log.info("일정 생성 요청: {} ~ {}, 관광지 {}개",
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getSpotIds() != null ? request.getSpotIds().size() : 0);
            ItineraryRespDto result = itineraryService.createItinerary(request);

            log.info("일정 생성 완료: {}일",
                    request.getTravelDays());
            return ResponseEntity.ok(result);
        }

    @GetMapping("/health")
    @Operation(summary = "상태 확인", description = "일정 생성 서비스 상태 확인")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Itinerary Service is running");
    }
}