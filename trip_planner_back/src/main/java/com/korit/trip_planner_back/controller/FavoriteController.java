package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.security.PrincipalUser;
import com.korit.trip_planner_back.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    private final FavoriteService favoriteService; // Mapper 대신 Service를 주입!

    @GetMapping("")
    public ResponseEntity<?> getFavorites() {
        int userId = PrincipalUser.getAuthenticatedPrincipalUser().getUser().getUserId();
        return ResponseEntity.ok().body(favoriteService.getFavorites(userId));
    }

    @PostMapping("/{spotId}")
    public ResponseEntity<?> addFavorite(@PathVariable Integer spotId) {
        int userId = PrincipalUser.getAuthenticatedPrincipalUser().getUser().getUserId();
        favoriteService.addFavorite(userId, spotId);
        return ResponseEntity.ok().body("성공");
    }

    @DeleteMapping("/{spotId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Integer spotId) {
        int userId = PrincipalUser.getAuthenticatedPrincipalUser().getUser().getUserId();
        favoriteService.removeFavorite(userId, spotId);
        return ResponseEntity.ok().body("삭제성공");
    }
}
