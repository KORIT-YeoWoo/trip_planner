package com.korit.trip_planner_back.controller;

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
    public ResponseEntity<TspResponseDto> calculateRoute(
            @RequestBody TspRequestDto request) {

        TspResponseDto result = tspService.calculateOptimalRoute(request);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "API 상태 확인",
            description = "TSP API가 정상 작동하는지 확인합니다."
    )
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("TSP API is running");
    }
}