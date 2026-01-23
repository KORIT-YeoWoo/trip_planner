package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.ItineraryItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItineraryItemMapper {
    int insert(ItineraryItem item);
    List<ItineraryItem> findByDayId(
            @Param("itineraryId") Integer itineraryId,
            @Param("day") Integer day
    );
    void deleteByDay(@Param("itineraryId") Integer itineraryId, @Param("day") Integer day);

    void deleteByItineraryIdAndDayAndSpotId(
            @Param("itineraryId") Integer itineraryId,
            @Param("day") Integer day,
            @Param("spotId") Integer spotId
    );
}