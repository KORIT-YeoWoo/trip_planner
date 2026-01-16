package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.Favorite;
import com.korit.trip_planner_back.entity.TouristSpot;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FavoriteMapper {
    void insert(Favorite favorite);

    List<TouristSpot> findByUserId(int userId);

    void deleteById(@Param("userId")int userId,@Param("spotId") int spotId);
}
