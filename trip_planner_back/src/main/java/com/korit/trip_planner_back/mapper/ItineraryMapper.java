package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.Itinerary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItineraryMapper {

    // 기본 CRUD
    void insert(Itinerary itinerary);

    Itinerary selectById(Long itineraryId);

    List<Itinerary> selectAll();

    void update(Itinerary itinerary);

    void deleteById(Long itineraryId);

//    // 사용자별 일정 조회
//    List<Itinerary> selectByUserId(
//            @Param("userId") Long userId,
//            @Param("offset") int offset,
//            @Param("size") int size
//    );
//
//    // 사용자 일정 개수
//    long countByUserId(Long userId);
//
//    // 일정 상세 조회 (일차, 아이템 포함)
//    Itinerary selectDetailById(Long itineraryId);
}