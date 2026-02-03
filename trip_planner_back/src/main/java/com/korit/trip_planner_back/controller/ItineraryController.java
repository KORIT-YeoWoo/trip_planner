package com.korit.trip_planner_back.controller;

import com.korit.trip_planner_back.dto.request.DurationUpdateDto;
import com.korit.trip_planner_back.dto.request.ItineraryReqDto;
import com.korit.trip_planner_back.dto.request.ItinerarySaveDto;
import com.korit.trip_planner_back.dto.request.ReorderRequestDto;
import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ItineraryListDto;
import com.korit.trip_planner_back.dto.response.ItineraryRespDto;
import com.korit.trip_planner_back.security.PrincipalUser;
import com.korit.trip_planner_back.service.ItineraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/save")
    @Operation(summary = "일정 저장", description = "생성된 일정을 DB에 저장")
    public ResponseEntity<ItineraryRespDto> saveItinerary(@RequestBody ItinerarySaveDto request) {
        log.info("일정 저장 요청: {} ~ {}, {}일",
                request.getStartDate(),
                request.getEndDate(),
                request.getDays().size());

        ItineraryRespDto result = itineraryService.saveItinerary(request);

        log.info("일정 저장 완료: itineraryId={}", result.getItineraryId());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{itineraryId}/days/{day}/reorder")
    @Operation(summary = "일정 순서 변경", description = "특정 날짜의 관광지 순서를 변경하고 TSP 재계산")
    public ResponseEntity<DayScheduleDto> reorderDaySchedule(
            @PathVariable Integer itineraryId,
            @PathVariable Integer day,
            @RequestBody ReorderRequestDto request) {

        log.info("일정 순서 변경 요청: itinerary={}, day={}, items={}",
                itineraryId, day, request.getSpotIds().size());

        DayScheduleDto result = itineraryService.reorderDaySchedule(
                itineraryId,
                day,
                request.getSpotIds()
        );

        log.info("일정 순서 변경 완료: day={}",day);
        return  ResponseEntity.ok(result);
    }

    @PutMapping("/{itineraryId}/days/{day}/items/{spotId}/duration")
    public ResponseEntity<DayScheduleDto> updateItemDuration(
            @PathVariable Integer itineraryId,
            @PathVariable Integer day,
            @PathVariable Integer spotId,
            @RequestBody DurationUpdateDto request) {

        DayScheduleDto result = itineraryService.updateItemDuration(
                itineraryId, day, spotId, request.getDuration()
        );

        return ResponseEntity.ok(result);
    }
    @DeleteMapping("/{itineraryId}")
    @Operation(summary = "일정 삭제", description = "일정 전체 삭제")
    public ResponseEntity<Void> deleteItinerary(@PathVariable Integer itineraryId) {
        // 권한 체크
        PrincipalUser principalUser = PrincipalUser.getAuthenticatedPrincipalUser();

        if (principalUser == null) {
            return ResponseEntity.status(401).build();
        }

        Integer userId = principalUser.getUser().getUserId();

        log.info("일정 삭제 요청: itineraryId={}, userId={}", itineraryId, userId);

        itineraryService.deleteItinerary(itineraryId, userId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{itineraryId}/days/{day}/items/{spotId}")
    public ResponseEntity<DayScheduleDto> deleteScheduleItem(
            @PathVariable Integer itineraryId,
            @PathVariable Integer day,
            @PathVariable Integer spotId){

        log.info("관광지 삭제 요청: itinerary={}, day={}, spotId={}", itineraryId, day, spotId);

        DayScheduleDto result = itineraryService.deleteScheduleItem(
                itineraryId,
                day,
                spotId
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

    @GetMapping("/my")
    @Operation(summary = "내 일정 목록", description = "로그인한 사용자의 일정 목록 조회")
    public ResponseEntity<List<ItineraryListDto>> getMyItineraries() {
        // 현재 로그인한 사용자 ID 가져오기
        PrincipalUser principalUser = PrincipalUser.getAuthenticatedPrincipalUser();

        if (principalUser == null) {
            return ResponseEntity.status(401).build();
        }

        Integer userId = principalUser.getUser().getUserId();
        log.info("내 일정 목록 조회 요청: userId={}", userId);

        List<ItineraryListDto> result = itineraryService.getMyItineraries(userId);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    @Operation(summary = "상태 확인", description = "일정 생성 서비스 상태 확인")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Itinerary Service is running");
    }
}