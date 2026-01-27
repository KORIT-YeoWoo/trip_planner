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

/**
 * 일정 관리 파사드 서비스
 *
 * 실제 비즈니스 로직은 각 전문 서비스에 위임
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryCreationService creationService;
    private final ItineraryQueryService queryService;
    private final DayScheduleService dayScheduleService;
    private final ItineraryMapper itineraryMapper;

    /**
     * 일정 생성 (AI 중심)
     */
    public ItineraryRespDto createItinerary(ItineraryReqDto request) {
        log.info("=== 일정 생성 요청: {}박{}일, 관광지 {}개 ===",
                request.getNights(),
                request.getTravelDays(),
                request.getSpotIds().size());

        return creationService.create(request);
    }

    /**
     * 일정 저장
     */
    public ItineraryRespDto saveItinerary(ItinerarySaveDto request) {
        log.info("=== 일정 저장 요청: {} ~ {}, {}일 ===",
                request.getStartDate(),
                request.getEndDate(),
                request.getDays().size());

        return creationService.save(request);
    }

    /**
     * 일정 조회
     */
    public ItineraryRespDto getItinerary(Integer itineraryId) {
        log.info("=== 일정 조회: ID={} ===", itineraryId);
        return queryService.findById(itineraryId);
    }

    /**
     * Day 순서 변경
     */
    public DayScheduleDto reorderDaySchedule(
            Integer itineraryId,
            Integer day,
            List<Integer> spotIds) {

        log.info("=== Day {} 순서 변경: {}개 관광지 ===", day, spotIds.size());
        return dayScheduleService.reorder(itineraryId, day, spotIds);
    }

    /**
     * 체류시간 변경
     */
    public DayScheduleDto updateItemDuration(
            Integer itineraryId,
            Integer day,
            Integer spotId,
            Integer duration) {

        log.info("=== Day {} 체류시간 변경: spotId={}, {}분 ===",
                day, spotId, duration);
        return dayScheduleService.updateDuration(itineraryId, day, spotId, duration);
    }

    /**
     * 관광지 삭제
     */
    public DayScheduleDto deleteScheduleItem(
            Integer itineraryId,
            Integer day,
            Integer spotId) {

        log.info("=== Day {} 관광지 삭제: spotId={} ===", day, spotId);
        return dayScheduleService.deleteSpot(itineraryId, day, spotId);
    }

    public List<ItineraryListDto> getMyItineraries(Integer userId) {
        log.info("=== 내 일정 목록 조회 요청: userId={} ===", userId);
        return queryService.findMyItineraries(userId);
    }

    public void deleteItinerary(Integer itineraryId, Integer userId) {
        log.info("=== 일정 삭제: ID={}, userId={} ===", itineraryId, userId);

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