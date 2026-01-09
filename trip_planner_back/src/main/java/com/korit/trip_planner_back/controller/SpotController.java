package com.korit.trip_planner_back.controller;


import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")


@RestController
@RequiredArgsConstructor
public class SpotController {

    private final TouristSpotMapper touristSpotMapper;

    @GetMapping(value = "/json", produces = "application/json; charset=UTF-8")
    public List<TouristSpot> json() {
        return touristSpotMapper.findByPage(1000, 0);
    }
}
