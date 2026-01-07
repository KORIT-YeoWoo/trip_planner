package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoriteMapper {
    void insert(Favorite favorite);

    Favorite findByUserId(int userId);

    void deleteById(Long itineraryId);
}
