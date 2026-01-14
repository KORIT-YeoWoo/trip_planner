package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.entity.Favorite;
import com.korit.trip_planner_back.mapper.FavoriteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    private final FavoriteMapper favoriteMapper;

    @PostMapping("/{spotId}")

    public ResponseEntity<?> addFavorite(@PathVariable Integer spotId){
        Integer userId = 1;//테스트용
        Favorite favorite = Favorite.builder()
                        .spotId(spotId).userId(userId).createdAt(LocalDateTime.now()).build();

        System.out.println("---------------------------");
        System.out.println("spotID:"+spotId);
        System.out.println("---------------------------");
        favoriteMapper.insert(favorite);



        return ResponseEntity.ok().body("성공");
    }
    @DeleteMapping("/{spotId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Integer spotId){
        Integer userId = 1;
        favoriteMapper.deleteById(userId,spotId);
        return ResponseEntity.ok().body("삭제성공");
    }
}
