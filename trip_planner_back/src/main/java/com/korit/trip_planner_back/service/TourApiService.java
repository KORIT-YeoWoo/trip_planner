package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.TouristSpotMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class TourApiService {

    private final TouristSpotMapper touristSpotMapper;

    public List<TouristSpot> getSpots(int page, int size) {
        int offset = (page - 1) * size;
        return touristSpotMapper.findByPage(size, offset);
    }

    public TouristSpot getSpot(int spotId) {
        return touristSpotMapper.findById(spotId);
    }
}
