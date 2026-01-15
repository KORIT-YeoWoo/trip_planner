package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.dto.common.ApiResponse;
import com.korit.trip_planner_back.dto.common.ErrorResponse;
import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.service.ItineraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResponse<ItineraryRespDto>> generateItinerary(
            @RequestBody ItineraryReqDto request) {

        try {
            log.info("일정 생성 요청: {} ~ {}, 관광지 {}개",
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getSpotIds() != null ? request.getSpotIds().size() : 0);

            ItineraryRespDto result = itineraryService.createItinerary(request);

            log.info("일정 생성 완료: {}박{}일, 총 {}개 관광지",
                    request.getNights(),
                    request.getTravelDays(),
                    result.getTotalSpots());

            return ResponseEntity.ok(
                    ApiResponse.<ItineraryRespDto>builder()
                            .success(true)
                            .data(result)
                            .message("일정이 생성되었습니다.")
                            .build()
            );

        } catch (IllegalArgumentException e) {
            log.warn("일정 생성 실패 (검증 오류): {}", e.getMessage());

            return ResponseEntity.badRequest().body(
                    ApiResponse.<ItineraryRespDto>builder()
                            .success(false)
                            .message("입력값 오류")
                            .error(ErrorResponse.builder()
                                    .code("VALIDATION_ERROR")
                                    .message(e.getMessage())
                                    .build())
                            .build()
            );

        } catch (Exception e) {
            log.error("일정 생성 실패 (서버 오류): {}", e.getMessage(), e);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<ItineraryRespDto>builder()
                            .success(false)
                            .message("일정 생성 중 오류가 발생했습니다.")
                            .error(ErrorResponse.builder()
                                    .code("SERVER_ERROR")
                                    .message(e.getMessage())
                                    .build())
                            .build()
            );
        }
    }

    @GetMapping("/health")
    @Operation(summary = "상태 확인", description = "일정 생성 서비스 상태 확인")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .data("Itinerary Service is running")
                        .message("정상")
                        .build()
        );
    }
}