package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.dto.response.TravelStyleDTO;
import com.korit.trip_planner_back.security.PrincipalUser;
import com.korit.trip_planner_back.service.TravelStyleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/travel-style")
@Tag(name = "Travel Style", description = "여행 스타일 분석 API")
public class TravelStyleController {

    private final TravelStyleService travelStyleService;

    @GetMapping("/my")
    @Operation(summary = "내 여행 스타일 조회", description = "저장된 여행 데이터를 기반으로 여행 스타일 분석 (최소 3회 필요)")
    public ResponseEntity<TravelStyleDTO> getMyTravelStyle() {
        // 현재 로그인한 사용자 ID 가져오기
        PrincipalUser principalUser = PrincipalUser.getAuthenticatedPrincipalUser();

        if (principalUser == null) {
            return ResponseEntity.status(401).build();
        }

        Integer userId = principalUser.getUser().getUserId();

        TravelStyleDTO result = travelStyleService.analyzeTravelStyle(userId);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    @Operation(summary = "상태 확인", description = "여행 스타일 서비스 상태 확인")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Travel Style Service is running");
    }
}