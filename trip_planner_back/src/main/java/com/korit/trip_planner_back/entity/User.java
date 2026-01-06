package com.korit.trip_planner_back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class User {
    private int userId;
    private int oauth2Id;
    private String name;
    private String nickname;
    private int age;
    private String gender;
    private String phone;
    private String email;
    private String profileImg;
    private LocalDateTime createdAt;
}
