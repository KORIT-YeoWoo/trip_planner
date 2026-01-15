package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.dto.common.ApiResponse;
import com.korit.trip_planner_back.dto.common.ErrorResponse;
import com.korit.trip_planner_back.dto.tsp.TspRequestDto;
import com.korit.trip_planner_back.dto.tsp.TspResponseDto;
import com.korit.trip_planner_back.service.TspService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "TSP", description = "여행 경로 최적화 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tsp")
public class TspController {

    private final TspService tspService;

    @Operation(
            summary = "최적 경로 계산",
            description = "선택한 관광지들의 최적 방문 순서를 Greedy + 2-Opt 알고리즘으로 계산합니다."
    )
    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<TspResponseDto>> calculateRoute(
            @RequestBody TspRequestDto request) {

        try {
            TspResponseDto result = tspService.calculateOptimalRoute(request);
            return ResponseEntity.ok(ApiResponse.success(result));

        } catch (IllegalArgumentException e) {
            // 검증 실패 (잘못된 요청)
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .code("400")
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("요청이 올바르지 않습니다.", errorResponse));

        } catch (Exception e) {
            // 서버 오류
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .code("500")
                    .message("경로 계산 중 오류가 발생했습니다: " + e.getMessage())
                    .build();

            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("서버 오류가 발생했습니다.", errorResponse));
        }
    }

    @Operation(
            summary = "API 상태 확인",
            description = "TSP API가 정상 작동하는지 확인합니다."
    )
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
                ApiResponse.success("TSP API is running")
        );
    }
}