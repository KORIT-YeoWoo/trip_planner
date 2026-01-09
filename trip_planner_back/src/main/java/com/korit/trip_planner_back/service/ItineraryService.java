package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.mapper.ItineraryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryMapper itineraryMapper;

}
