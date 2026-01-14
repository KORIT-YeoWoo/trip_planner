package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FavoriteMapper {
    void insert(Favorite favorite);

    Favorite findByUserId(int userId);

    void deleteById(@Param("userId")int userId,@Param("spotId") int spotId);
}
