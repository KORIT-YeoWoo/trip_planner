package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.TouristSpot;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TouristSpotMapper {

    int insert(TouristSpot touristSpot);

    TouristSpot findById(@Param("spotId") int spotId);
    List<TouristSpot> findByPage(@Param("size") int size, @Param("offset") int offset);
    List<TouristSpot> findByCategory(@Param("category") String category);
    TouristSpot findBySearch(@Param("keyword") String keyword);

    int updateBySpotImg(@Param("spotId") int spotId, @Param("spotImg") String spotImg);

    int deleteById(@Param("spotId") int spotId);
}
