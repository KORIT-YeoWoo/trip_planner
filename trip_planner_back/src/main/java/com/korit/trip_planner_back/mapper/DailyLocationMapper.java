package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.DailyLocation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DailyLocationMapper {
    // 숙소 정보 저장
    int insert(DailyLocation dailyLocation);

    // 일정 ID로 모든 숙소 조회
    List<DailyLocation> findByItineraryId(@Param("itineraryId") Integer itineraryId);

    // 특정 일차의 숙소 조회
    DailyLocation findByItineraryIdAndDay(
            @Param("itineraryId") Integer itineraryId,
            @Param("dayNumber") Integer dayNumber
    );

    // 숙소 정보 수정
    int update(DailyLocation dailyLocation);

    // 숙소 정보 삭제
    int deleteById(@Param("dailyLocationId") Integer dailyLocationId);

    // 일정 ID로 모든 숙소 삭제
    int deleteByItineraryId(@Param("itinerary") Integer itineraryId);
}
