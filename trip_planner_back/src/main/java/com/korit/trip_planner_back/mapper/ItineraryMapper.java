package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.Itinerary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItineraryMapper {

    // 기본 CRUD
    void insert(Itinerary itinerary);

    Itinerary findByItineraryId(Integer itineraryId);

    List<Itinerary> findAll();

    void update(Itinerary itinerary);

    void deleteById(Integer itineraryId);

}