package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.request.ItinerarySaveDto;
import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ItineraryListDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.entity.Itinerary;
import com.korit.trip_planner_back.mapper.ItineraryMapper;
import com.korit.trip_planner_back.service.itinerary.DayScheduleService;
import com.korit.trip_planner_back.service.itinerary.ItineraryCreationService;
import com.korit.trip_planner_back.service.itinerary.ItineraryQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryCreationService creationService;
    private final ItineraryQueryService queryService;
    private final DayScheduleService dayScheduleService;
    private final ItineraryMapper itineraryMapper;

    // 일정 생성 (AI 중심)
    public ItineraryRespDto createItinerary(ItineraryReqDto request) {
        return creationService.create(request);
    }

    // 일정 저장
    public ItineraryRespDto saveItinerary(ItinerarySaveDto request) {
        return creationService.save(request);
    }

    // 일정 조회
    public ItineraryRespDto getItinerary(Integer itineraryId) {
        return queryService.findById(itineraryId);
    }

    // Day 순서 변경
    public DayScheduleDto reorderDaySchedule(
            Integer itineraryId,
            Integer day,
            List<Integer> spotIds) {

        return dayScheduleService.reorder(itineraryId, day, spotIds);
    }

    // 체류시간 변경
    public DayScheduleDto updateItemDuration(
            Integer itineraryId,
            Integer day,
            Integer spotId,
            Integer duration) {

        return dayScheduleService.updateDuration(itineraryId, day, spotId, duration);
    }

    // 관광지 삭제
    public DayScheduleDto deleteScheduleItem(
            Integer itineraryId,
            Integer day,
            Integer spotId) {

        return dayScheduleService.deleteSpot(itineraryId, day, spotId);
    }

    public List<ItineraryListDto> getMyItineraries(Integer userId) {
        return queryService.findMyItineraries(userId);
    }

    public void deleteItinerary(Integer itineraryId, Integer userId) {

        // 권한 확인 (내 일정만 삭제 가능)
        Itinerary itinerary = itineraryMapper.findByItineraryId(itineraryId);

        if (itinerary == null) {
            throw new RuntimeException("일정을 찾을 수 없습니다.");
        }

        if (!itinerary.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        itineraryMapper.deleteById(itineraryId);
        log.info("일정 삭제 완료: ID={}", itineraryId);
    }
}