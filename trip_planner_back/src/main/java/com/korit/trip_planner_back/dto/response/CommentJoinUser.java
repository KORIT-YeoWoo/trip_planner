package com.korit.trip_planner_back.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentJoinUser {
    private int commentId;
    private int spotId;
    private int userId;
    private String username;
    private int starScore;
    private String content;
    private LocalDateTime createdAt;
}