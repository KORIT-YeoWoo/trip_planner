package com.korit.trip_planner_back.controller;


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
}