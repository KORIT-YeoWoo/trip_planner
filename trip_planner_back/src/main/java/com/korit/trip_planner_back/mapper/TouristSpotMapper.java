package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.TouristSpot;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TouristSpotMapper {
    void insert(TouristSpot touristSpot);

    TouristSpot findById(int spotId);
    TouristSpot updateBySpotImg(String spotImg);

    void deleteById(TouristSpot touristSpot);
}
