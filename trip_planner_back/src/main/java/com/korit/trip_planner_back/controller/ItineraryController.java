package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.dto.request.DurationUpdateDto;
import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.request.ReorderRequestDto;
import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.service.ItineraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/itinerary")
@Tag(name = "Itinerary", description = "일정 생성 API")
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/generate")
    @Operation(summary = "일정 생성", description = "여행 일정 자동 생성 (TSP 최적화)")
    public ResponseEntity<ItineraryRespDto> generateItinerary(@RequestBody ItineraryReqDto request) {
        log.info("일정 생성 요청: {} ~ {}, 관광지 {}개",
            request.getStartDate(),
            request.getEndDate(),
            request.getSpotIds() != null ? request.getSpotIds().size() : 0);
        ItineraryRespDto result = itineraryService.createItinerary(request);

        log.info("일정 생성 완료: {}일",
                request.getTravelDays());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{itineraryId}/days/{day}/reorder")
    @Operation(summary = "일정 순서 변경", description = "특정 날짜의 관광지 순서를 변경하고 TSP 재계산")
    public ResponseEntity<DayScheduleDto> reorderDaySchedule(
            @PathVariable Integer itineraryId,
            @PathVariable Integer day,
            @RequestBody ReorderRequestDto request) {

        log.info("일정 순서 변경 요청: itinerary={}, day={}, items={}",
            itineraryId, day, request.getItemIds().size());

        DayScheduleDto result = itineraryService.reorderDaySchedule(
            itineraryId,
            day,
            request.getItemIds()
        );

        log.info("일정 순서 변경 완료: day={}",day);
        return  ResponseEntity.ok(result);
    }
    // 일정 항목의 체류 시간 변경
    @PutMapping("/{itineraryId}/days/{day}/items/{itemId}/duration")
    public ResponseEntity<DayScheduleDto> updateItemDuration(
            @PathVariable Integer itineraryId,
            @PathVariable Integer day,
            @PathVariable Integer itemId,
            @RequestBody DurationUpdateDto request) {

        DayScheduleDto result = itineraryService.updateItemDuration(
                itineraryId, day, itemId, request.getDuration()
        );

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{itineraryId}/days/{day}/items/{itemId}")
    @Operation(summary = "관광지 삭제", description = "특정 날짜의 관광지를 삭제하고 일정 재계산")
    public ResponseEntity<DayScheduleDto> deleteScheduleItem(
            @PathVariable Integer itineraryId,
            @PathVariable Integer day,
            @PathVariable Integer itemId){

        log.info("관광지 삭제 요청: itinerary={}, day={}, itemId={}", itineraryId, day, itemId);

        DayScheduleDto result = itineraryService.deleteScheduleItem(
                itineraryId,
                day,
                itemId
        );

        log.info("관광지 삭제 완료: day={}", day);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{itineraryId}")
    @Operation(summary = "일정 조회", description = "생성된 전체 여행 일정 조회")
    public ResponseEntity<ItineraryRespDto> getItinerary(
            @PathVariable Integer itineraryId
    ) {
        log.info("일정 조회 요청: itineraryId={}", itineraryId);

        ItineraryRespDto result = itineraryService.getItinerary(itineraryId);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    @Operation(summary = "상태 확인", description = "일정 생성 서비스 상태 확인")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Itinerary Service is running");
    }
}