package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.security.PrincipalUser;
import com.korit.trip_planner_back.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal PrincipalUser principalUser) {
        return ResponseEntity.ok(principalUser.getUser());
    }

}