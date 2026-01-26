package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.entity.Favorite;
import com.korit.trip_planner_back.entity.TouristSpot;
import com.korit.trip_planner_back.mapper.FavoriteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteMapper favoriteMapper;

    // 1. 조회 로직
    public List<TouristSpot> getFavorites(int userId) {
        return favoriteMapper.findByUserId(userId);
    }

    // 2. 추가 로직
    public void addFavorite(int userId, int spotId) {

        Favorite favorite = Favorite.builder()
                .userId(userId)
                .spotId(spotId)
                .createdAt(LocalDateTime.now())
                .build();
        favoriteMapper.insert(favorite);
    }

    // 3. 삭제 로직
    public void removeFavorite(int userId, int spotId) {
        favoriteMapper.deleteById(userId, spotId);
    }
}