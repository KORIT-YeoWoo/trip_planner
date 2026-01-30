package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.dto.response.CommentJoinUser;
import com.korit.trip_planner_back.dto.request.CommentReqDto;
import com.korit.trip_planner_back.dto.response.RatingSummaryResp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommentMapper {
    int insertComment(@Param("req")CommentReqDto reqDto,
                      @Param("userId") int userId);
    List<CommentJoinUser> findBySpotId(@Param("spotId") int spotId);
    RatingSummaryResp getRatingSummary(@Param("spotId") int spotId);

}
