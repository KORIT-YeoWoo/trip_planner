package com.korit.trip_planner_back.controller;


import com.korit.trip_planner_back.dto.response.ApiResponseDto;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")


@RestController // api 처리 컨트롤러
@RequestMapping("/api/spots")
@RequiredArgsConstructor
public class SpotController {

    private final TouristSpotMapper touristSpotMapper;

    // GET /api/spots
    @GetMapping
    public List<TouristSpot> getSpots(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        // 페이지네이션 로직 추가 필요
        int offset = (page - 1) * size;
        return touristSpotMapper.findByPage(size, offset);
    }

    @GetMapping("/{spotId}")
    public ApiResponseDto<Object> getSpot(@PathVariable int spotId) {
        TouristSpot spot = touristSpotMapper.findById(spotId);

        if (spot == null) {
            // 데이터가 없을 경우 에러 응답
            return ApiResponseDto.error("해당 스팟을 찾을 수 없습니다.");
        }

        // 데이터가 있을 경우 성공 응답
        return ApiResponseDto.success(spot);
    }
}