package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.TouristSpot;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TouristSpotMapper {
    void insert(TouristSpot touristSpot);

    TouristSpot findById(int spotId);
    TouristSpot updateBySpotImg(String spotImg);
    List<TouristSpot> findByPage(@Param("size") int size, @Param("offset") int offset);

    void deleteById(TouristSpot touristSpot);
}
