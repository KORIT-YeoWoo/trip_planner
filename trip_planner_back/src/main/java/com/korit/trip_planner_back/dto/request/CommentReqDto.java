package com.korit.trip_planner_back.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentReqDto {
    private Integer spotId;
    private int starScore;
    private String content;
}
