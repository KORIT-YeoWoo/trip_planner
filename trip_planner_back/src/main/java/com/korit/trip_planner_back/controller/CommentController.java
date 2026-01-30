package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.dto.request.CommentReqDto;
import com.korit.trip_planner_back.dto.response.ApiResponseDto;

import com.korit.trip_planner_back.dto.response.RatingSummaryResp;
import com.korit.trip_planner_back.security.PrincipalUser;
import com.korit.trip_planner_back.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class CommentController {
    private final CommentService commentService;
    @PostMapping("/api/comments")
    public ApiResponseDto<?> createComment(@RequestBody CommentReqDto reqDto,
                                           @AuthenticationPrincipal PrincipalUser user){
        if(user == null){
            return ApiResponseDto.error("로그인 필요");
        }

        commentService.createComment(reqDto,user.getUser().getUserId());
        return ApiResponseDto.success(null);
    }
    @GetMapping("/api/comments/spots/{spotId}")
    public ApiResponseDto<?> getComments(@PathVariable int spotId) {
        return ApiResponseDto.success(commentService.getCommentsBySpotId(spotId));
    }
    @GetMapping("/api/comments/spots/{spotId}/rating-summary")
    public ApiResponseDto<RatingSummaryResp> getRatingsSummary(
            @PathVariable int spotId
    ){
        return ApiResponseDto.success(commentService.getRatingSummary(spotId));
    }

}
