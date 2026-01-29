package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.dto.request.CommentReqDto;
import com.korit.trip_planner_back.dto.response.CommentJoinUser;
import com.korit.trip_planner_back.dto.response.RatingSummaryResp;
import com.korit.trip_planner_back.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CommentService {
    private final CommentMapper commentMapper;

    public void createComment(CommentReqDto reqDto , int userId){
        commentMapper.insertComment(reqDto,userId);
    }
    public List<CommentJoinUser> getCommentsBySpotId(int spotId) {
        return commentMapper.findBySpotId(spotId);
    }
    public RatingSummaryResp getRatingSummary(int spotId){
        return commentMapper.getRatingSummary(spotId);
    }
}
