package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.ItineraryDay;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItineraryDayMapper {
    int insert(ItineraryDay itineraryDay);

    List<ItineraryDay> findByItineraryId(@Param("itineraryId") Integer itineraryId);

    ItineraryDay findByItineraryIdAndDay(
            @Param("itineraryId") Integer itineraryId,
            @Param("day") Integer day
    );

    void update(ItineraryDay day);
}