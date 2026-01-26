package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.security.PrincipalUser;
import com.korit.trip_planner_back.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

<<<<<<< Updated upstream
=======
import java.time.LocalDateTime;

@Slf4j  // ✅ 추가
>>>>>>> Stashed changes
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    private final FavoriteService favoriteService; // Mapper 대신 Service를 주입!

    @GetMapping("")
    public ResponseEntity<?> getFavorites() {
<<<<<<< Updated upstream
        int userId = PrincipalUser.getAuthenticatedPrincipalUser().getUser().getUserId();
        return ResponseEntity.ok().body(favoriteService.getFavorites(userId));
=======
        // ✅ 수정: null 체크 추가
        PrincipalUser principalUser = PrincipalUser.getAuthenticatedPrincipalUser();

        if (principalUser == null) {
            log.warn("⚠️ 인증되지 않은 사용자의 즐겨찾기 조회 시도");
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        int userId = principalUser.getUser().getUserId();
        log.info("✅ 사용자 {} 즐겨찾기 조회", userId);

        return ResponseEntity.ok().body(favoriteMapper.findByUserId(userId));
>>>>>>> Stashed changes
    }

    @PostMapping("/{spotId}")
    public ResponseEntity<?> addFavorite(@PathVariable Integer spotId) {
<<<<<<< Updated upstream
        int userId = PrincipalUser.getAuthenticatedPrincipalUser().getUser().getUserId();
        favoriteService.addFavorite(userId, spotId);
=======
        // ✅ 수정: null 체크 추가
        PrincipalUser principalUser = PrincipalUser.getAuthenticatedPrincipalUser();

        if (principalUser == null) {
            log.warn("⚠️ 인증되지 않은 사용자의 즐겨찾기 추가 시도");
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        int userId = principalUser.getUser().getUserId();

        Favorite favorite = Favorite.builder()
                .spotId(spotId)
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();

        log.info("✅ 사용자 {} 즐겨찾기 추가: spotId={}", userId, spotId);

        favoriteMapper.insert(favorite);

>>>>>>> Stashed changes
        return ResponseEntity.ok().body("성공");
    }

    @DeleteMapping("/{spotId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Integer spotId) {
<<<<<<< Updated upstream
        int userId = PrincipalUser.getAuthenticatedPrincipalUser().getUser().getUserId();
        favoriteService.removeFavorite(userId, spotId);
=======
        // ✅ 수정: null 체크 추가
        PrincipalUser principalUser = PrincipalUser.getAuthenticatedPrincipalUser();

        if (principalUser == null) {
            log.warn("⚠️ 인증되지 않은 사용자의 즐겨찾기 삭제 시도");
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        int userId = principalUser.getUser().getUserId();

        log.info("✅ 사용자 {} 즐겨찾기 삭제: spotId={}", userId, spotId);

        favoriteMapper.deleteById(userId, spotId);

>>>>>>> Stashed changes
        return ResponseEntity.ok().body("삭제성공");
    }
}