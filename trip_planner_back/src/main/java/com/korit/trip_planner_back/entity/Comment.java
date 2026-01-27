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

public class Comment {
    private int commentId;
    private int spotId;
    private int userId;
    private String content;
    private LocalDateTime createdAt;
    private int starScore;
}
