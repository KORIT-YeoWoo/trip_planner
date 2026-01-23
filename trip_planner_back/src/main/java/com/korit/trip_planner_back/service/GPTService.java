package com.korit.trip_planner_back.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korit.trip_planner_back.dto.gpt.DayDistributionDto;
import com.korit.trip_planner_back.dto.request.DailyLocationDto;
import com.korit.trip_planner_back.dto.response.DayScheduleDto;
import com.korit.trip_planner_back.dto.response.ScheduleItemDto;
import com.korit.trip_planner_back.entity.TouristSpot;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

// GPT API 연동 서비스
@Slf4j
@Service
public class GPTService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${openai.model:gpt-4}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // GPT 1차: 관광지 필터링 + Day 그룹핑
    public DayDistributionDto filterAndGroupSpots(
            List<TouristSpot> allSpots,
            int travelDays,
            List<DailyLocationDto> dailyLocations,
            String transport) {

        log.info("GPT 필터링 시작: 관광지 {}개 → {}박{}일",
                allSpots.size(), travelDays - 1, travelDays);

        try {
            // 1. 프롬프트 생성
            String prompt = buildFilteringPrompt(
                    allSpots,
                    travelDays,
                    dailyLocations,
                    transport);

            // 2. GPT API 호출
            String gptResponse = callGptApi(prompt);

            // 3. 응답 파싱
            DayDistributionDto result = parseDistributionResponse(gptResponse, allSpots);

            // 4. excludedSpots 계산 (GPT가 안 줬으면 직접 계산)
            if (result.getExcludedSpots() == null || result.getExcludedSpots().isEmpty()) {
                List<Integer> excluded = calculateExcludedSpots(allSpots, result.getSelectedSpots());
                result.setExcludedSpots(excluded);

                if (!excluded.isEmpty()) {
                    result.setExcludeReason(String.format(
                            "%d박%d일 기준 적정 관광지 수로 조정 (%d개 제외)",
                            travelDays - 1, travelDays, excluded.size()
                    ));
                }
            }

            log.info("GPT 필터링 완료: 선택 {}개, 제외 {}개",
                    result.getSelectedSpots().size(),
                    result.getExcludedSpots().size());

            return result;

        } catch (Exception e) {
            log.error("GPT 필터링 실패: {}", e.getMessage(), e);
            // 실패 시 전체 선택
            return createDefaultDistribution(allSpots, travelDays);
        }
    }

    // 제외된 관광지 계산
    private List<Integer> calculateExcludedSpots(List<TouristSpot> allSpots, List<Integer> selectedIds) {
        Set<Integer> selectedSet = new HashSet<>(selectedIds);

        return allSpots.stream()
                .map(TouristSpot::getSpotId)
                .filter(id -> !selectedSet.contains(id))
                .collect(Collectors.toList());
    }

    // 최종 일정 다듬기
    public List<DayScheduleDto> refineSchedule(List<DayScheduleDto> days) {
        log.info("GPT 일정 다듬기 시작: {}일", days.size());

        try {
            // 1. 프롬프트 생성
            String prompt = buildRefinementPrompt(days);

            // 2. GPT API 호출
            String gptResponse = callGptApi(prompt);

            // 3. 응답 파싱
            List<DayScheduleDto> refined = parseRefinementResponse(gptResponse, days);

            log.info("GPT 일정 다듬기 완료");

            return refined;

        } catch (Exception e) {
            log.error("GPT 일정 다듬기 실패: {}", e.getMessage(), e);
            // 실패 시 원본 반환
            return days;
        }
    }

    // GPT 1차 프롬프트: 필터링 + 그룹핑만
    private String buildFilteringPrompt(
            List<TouristSpot> allSpots,
            int travelDays,
            List<DailyLocationDto> dailyLocations,
            String transport) {

        StringBuilder sb = new StringBuilder();

        sb.append("당신은 제주도 여행 전문가입니다.\n\n");

        // ✅ 여행 정보 (Day별 동선 명확히 표시)
        sb.append("### 여행 정보\n");
        sb.append("- 기간: ").append(travelDays - 1).append("박").append(travelDays).append("일\n");
        sb.append("- 교통: ").append(transport).append("\n");
        sb.append("\n");

        sb.append("### 각 날짜별 동선\n");
        for (DailyLocationDto dayLoc : dailyLocations) {
            sb.append("- Day ").append(dayLoc.getDay()).append(": ")
                    .append(dayLoc.getStartName()).append(" (")
                    .append(String.format("%.4f", dayLoc.getStartLat())).append(", ")
                    .append(String.format("%.4f", dayLoc.getStartLon())).append(")")
                    .append(" → ... → ")
                    .append(dayLoc.getEndName()).append(" (")
                    .append(String.format("%.4f", dayLoc.getEndLat())).append(", ")
                    .append(String.format("%.4f", dayLoc.getEndLon())).append(")")
                    .append("\n");
        }
        sb.append("\n");

        // 관광지 정보 (기존과 동일)
        sb.append("### 선택된 관광지 (").append(allSpots.size()).append("개)\n");
        for (TouristSpot spot : allSpots) {
            sb.append("- ID:").append(spot.getSpotId())
                    .append(" | ").append(spot.getTitle())
                    .append(" | 위치:(").append(spot.getLatitude()).append(",").append(spot.getLongitude()).append(")")
                    .append(" | 카테고리:").append(spot.getCategory())
                    .append(" | 소요시간:").append(spot.getSpotDuration()).append("분");

            if (spot.isIsland()) {
                sb.append(" | ⭐섬 (페리 포함 6시간)");
            }
            sb.append("\n");
        }

        sb.append("\n### 요청사항\n");
        sb.append("1. 위 관광지를 ").append(travelDays).append("일로 그룹핑하세요\n");
        sb.append("2. **각 날짜의 출발지/도착지를 고려**해서 지역적으로 가까운 것끼리 묶으세요\n");
        sb.append("   예: Day 1이 공항→중문이면, 동쪽→남쪽 순서로 관광지 배치\n");
        sb.append("3. 섬(우도/마라도/가파도)은 하루에 1개만, 최대 3개 관광지\n");
        sb.append("4. 너무 많으면 제외하세요 (1일당 3~5개 권장)\n");

        sb.append("### ⚠️ 중요 규칙 ⚠️\n");
        sb.append("각 날짜마다 최소 1개 이상의 관광지를 반드시 배정해야 합니다.\n");
        sb.append("빈 날이 생기면 안 됩니다. 모든 날짜에 관광지를 골고루 분산시켜주세요.\n");
        sb.append("❌ 관광지 방문 순서는 절대 정하지 마세요\n");
        sb.append("❌ 시간표를 만들지 마세요\n");
        sb.append("❌ \"효율적인 경로\"를 고려하지 마세요\n");
        sb.append("✅ Day별로 가까운 관광지를 묶기만 하세요\n");
        sb.append("✅ 숙소 위치를 참고하세요 (정확한 경로는 서버가 계산)\n\n");

        // ✅ 추가: 관광지 개수 가이드
        sb.append("### 📋 하루 관광지 개수 가이드\n");
        sb.append("- 섬이 있는 날: 섬 1개 + 일반 관광지 1~2개 (총 2~3개)\n");
        sb.append("  └─ 이유: 섬은 페리 포함 최소 6시간 소요\n");
        sb.append("- 섬이 없는 날: 일반 관광지 4~5개\n");
        sb.append("  └─ 이유: 관광지당 1~2시간, 이동 30분~1시간 가정\n");
        sb.append("- 가능한 많이 선택하되, 현실적인 일정으로!\n\n");

        // ✅ 추가: 제외 기준 명확화
        sb.append("### ❌ 제외 기준\n");
        sb.append("1. 숙소에서 너무 먼 관광지 (50km 이상)\n");
        sb.append("2. 다른 관광지들과 방향이 정반대인 곳\n");
        sb.append("3. Day별로 묶기 어려운 외딴 곳\n");
        sb.append("⚠️ 단순히 개수가 많다는 이유로 제외하지 마세요!\n\n");

        sb.append("### 응답 형식 (JSON만)\n");
        sb.append("{\n");
        sb.append("  \"selectedSpots\": [1, 3, 5, 7, 9, 11],  // 선택된 관광지 ID\n");
        sb.append("  \"excludedSpots\": [2, 4],  // 제외된 관광지 ID\n");
        sb.append("  \"excludeReason\": \"숙소에서 너무 먼 관광지 제외\",\n");
        sb.append("  \"dayDistribution\": {\n");
        sb.append("    \"day1\": [1, 5],         // 섬 있음 → 2개\n");
        sb.append("    \"day2\": [3, 7, 9, 11]   // 섬 없음 → 4개\n");
        sb.append("  }\n");
        sb.append("}\n\n");
        sb.append("**중요: JSON만 반환하세요. 순서/시간 정보 없이!**");

        return sb.toString();
    }

    // GPT 2차: 최종 다듬기 프롬프트
    private String buildRefinementPrompt(List<DayScheduleDto> days) {
        StringBuilder sb = new StringBuilder();

        sb.append("당신은 제주도 여행 전문가입니다.\n\n");
        sb.append("⚠️ 아래 일정은 이미 최적화된 경로입니다.\n");
        sb.append("⚠️ 관광지 순서를 절대 바꾸지 마세요!\n\n");

        sb.append("### 현재 일정\n");
        for (DayScheduleDto day : days) {
            sb.append("\n#### Day ").append(day.getDay()).append("\n");
            sb.append("시작: ").append(day.getStartTime()).append("\n");
            sb.append("종료: ").append(day.getEndTime()).append("\n");

            if (day.getItems() != null) {
                sb.append("관광지 (순서 유지!):\n");
                day.getItems().forEach(item -> {
                    sb.append("  ").append(item.getOrder() + 1).append(". ")
                            .append(item.getName())
                            .append(" (").append(item.getArrivalTime())
                            .append("~").append(item.getDepartureTime())
                            .append(", ").append(item.getDuration()).append("분");

                    if (item.isIsland()) {
                        sb.append(" ⭐섬");
                    }

                    if (item.getTravelFromPrevious() != null) {
                        sb.append(" | 이동: ").append(item.getTravelFromPrevious().getDuration()).append("분");
                    }

                    sb.append(")\n");
                });
            }
        }
        sb.append("\n### ⭐ 필수 요청사항 (반드시 지켜야 함!)\n");
        sb.append("1. 점심시간 (12:00~13:00)에 반드시 식사 추가\n");
        sb.append("   - 11:30~13:30 사이에 관광지가 있으면, 그 관광지 후에 점심 추가\n");
        sb.append("   - 식당 정보가 없어도 '점심 식사' 항목을 추가해야 함\n");
        sb.append("2. 저녁시간 (18:00~19:00)에 반드시 식사 추가\n");
        sb.append("   - 17:30~19:30 사이에 관광지가 있으면, 그 관광지 후에 저녁 추가\n");
        sb.append("   - 식당 정보가 없어도 '저녁 식사' 항목을 추가해야 함\n");
        sb.append("3. 하루 일정이 최소 18:00까지는 진행되도록 조정\n");
        sb.append("   - 관광지 체류 시간을 늘리거나\n");
        sb.append("   - 식사 시간을 더 길게 잡거나\n");
        sb.append("   - 여유 시간을 추가\n");
        sb.append("4. 섬이 있는 날은 섬 체류시간 절대 단축 불가\n");
        sb.append("5. 관광지 순서는 절대 변경 금지\n\n");

        sb.append("### 응답 형식 (JSON만)\n");
        sb.append("{\n");
        sb.append("  \"days\": [\n");
        sb.append("    {\n");
        sb.append("      \"day\": 1,\n");
        sb.append("      \"adjustments\": [\n");
        sb.append("        {\n");
        sb.append("          \"type\": \"MEAL\",\n");
        sb.append("          \"insertAfterSpot\": \"성산일출봉\",\n");
        sb.append("          \"name\": \"점심 - 성산포 해산물\",\n");
        sb.append("          \"duration\": 60\n");
        sb.append("        },\n");
        sb.append("        {\n");
        sb.append("          \"type\": \"ADJUST_TIME\",\n");
        sb.append("          \"spotName\": \"우도\",\n");
        sb.append("          \"newDuration\": 300,\n");
        sb.append("          \"reason\": \"일정 시간 단축\"\n");
        sb.append("        }\n");
        sb.append("      ]\n");
        sb.append("    }\n");
        sb.append("  ]\n");
        sb.append("}\n\n");
        sb.append("**중요: JSON만 반환하세요. 순서는 절대 변경 금지!**");

        return sb.toString();
    }

    // GPT API 호출
    private String callGptApi(String prompt) throws Exception {
        log.info("GPT API 호출 시작");

        // 요청 헤더
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // 요청 바디
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);

        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.3);  // 일관성 중시 (창의성보다)
        requestBody.put("max_tokens", 2000);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // API 호출
        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        // 응답 파싱
        JsonNode root = objectMapper.readTree(response.getBody());
        String content = root.path("choices").get(0).path("message").path("content").asText();

        log.info("GPT API 응답 수신: {} chars", content.length());

        return content;
    }

    // Day 분배 응답 파싱
    private DayDistributionDto parseDistributionResponse(String gptResponse, List<TouristSpot> allSpots) {
        try {
            // JSON 추출 (```json ... ``` 제거)
            String jsonStr = extractJson(gptResponse);

            JsonNode root = objectMapper.readTree(jsonStr);

            // selectedSpots
            List<Integer> selectedIds = new ArrayList<>();
            root.path("selectedSpots").forEach(node -> selectedIds.add(node.asInt()));

            // excludedSpots
            List<Integer> excludedIds = new ArrayList<>();
            root.path("excludedSpots").forEach(node -> excludedIds.add(node.asInt()));

            String excludeReason = root.path("excludeReason").asText();

            // dayDistribution
            Map<Integer, List<Integer>> dayGroups = new HashMap<>();
            JsonNode dayDist = root.path("dayDistribution");

            // 🔴 수정 1: dayDistribution 없으면 균등 분배
            if (!dayDist.isMissingNode() && dayDist.isObject()) {
                for (int i = 1; i <= 10; i++) {  // 최대 10일
                    String dayKey = "day" + i;
                    if (dayDist.has(dayKey)) {
                        List<Integer> daySpots = new ArrayList<>();
                        dayDist.path(dayKey).forEach(node -> daySpots.add(node.asInt()));
                        dayGroups.put(i, daySpots);
                    }
                }
            } else {
                log.warn("dayDistribution 없음 - 균등 분배로 fallback");
                dayGroups = createEvenDistribution(selectedIds,
                        Math.min(selectedIds.size() / 3 + 1, 5));  // 최대 5일로 추정
            }

            // 🔴 수정 2: selectedSpots와 dayDistribution 일치 검증
            Set<Integer> groupedSpots = dayGroups.values().stream()
                    .flatMap(List::stream)
                    .collect(Collectors.toSet());

            // selectedSpots에는 있는데 dayGroups에 없는 것 제거
            selectedIds.removeIf(id -> !groupedSpots.contains(id));

            // dayGroups에는 있는데 selectedSpots에 없는 것 추가
            groupedSpots.stream()
                    .filter(id -> !selectedIds.contains(id))
                    .forEach(selectedIds::add);

            log.info("검증 완료 - 선택: {}, 그룹: {}", selectedIds.size(), groupedSpots.size());

            // 🔴 수정 3: 섬 혼합 방지
            dayGroups = separateIslandsIfMixed(dayGroups, allSpots);

            return DayDistributionDto.builder()
                    .selectedSpots(selectedIds)
                    .excludedSpots(excludedIds)
                    .excludeReason(excludeReason)
                    .dayGroups(dayGroups)
                    .build();

        } catch (Exception e) {
            log.error("GPT 응답 파싱 실패: {}", e.getMessage());
            throw new RuntimeException("GPT 응답 파싱 실패", e);
        }
    }

    // 균등 분배 생성 (fallback)
    private Map<Integer, List<Integer>> createEvenDistribution(List<Integer> spotIds, int days) {
        Map<Integer, List<Integer>> dayGroups = new HashMap<>();

        int spotsPerDay = spotIds.size() / days;
        int remainder = spotIds.size() % days;

        int startIndex = 0;
        for (int day = 1; day <= days; day++) {
            int daySpotCount = spotsPerDay + (day <= remainder ? 1 : 0);
            int endIndex = Math.min(startIndex + daySpotCount, spotIds.size());

            dayGroups.put(day, new ArrayList<>(spotIds.subList(startIndex, endIndex)));
            startIndex = endIndex;
        }

        return dayGroups;
    }

    // 섬 + 본섬 혼합 방지
    private Map<Integer, List<Integer>> separateIslandsIfMixed(
            Map<Integer, List<Integer>> dayGroups,
            List<TouristSpot> allSpots) {

        Map<Integer, TouristSpot> spotMap = allSpots.stream()
                .collect(Collectors.toMap(
                        TouristSpot::getSpotId,
                        spot -> spot
                ));

        Map<Integer, List<Integer>> result = new HashMap<>();
        List<Integer> spillover = new ArrayList<>();  // 넘친 관광지

        for (Map.Entry<Integer, List<Integer>> entry : dayGroups.entrySet()) {
            Integer day = entry.getKey();
            List<Integer> daySpots = entry.getValue();

            // 섬 확인
            List<Integer> islands = daySpots.stream()
                    .filter(id -> spotMap.containsKey(id) && spotMap.get(id).isIsland())
                    .toList();

            if (!islands.isEmpty() && daySpots.size() > 3) {
                // 섬 + 일반 2개만 유지
                log.warn("Day {} 섬 혼합 감지 - 조정", day);

                List<Integer> kept = new ArrayList<>();
                kept.addAll(islands);  // 섬 우선

                // 일반 관광지 최대 2개
                daySpots.stream()
                        .filter(id -> !islands.contains(id))
                        .limit(2)
                        .forEach(kept::add);

                // 나머지는 spillover
                daySpots.stream()
                        .filter(id -> !kept.contains(id))
                        .forEach(spillover::add);

                result.put(day, kept);
            } else {
                result.put(day, daySpots);
            }
        }

        // spillover를 다음 Day에 추가
        if (!spillover.isEmpty()) {
            log.info("spillover {} 처리", spillover.size());

            // 섬 없는 Day 찾아서 추가
            for (Map.Entry<Integer, List<Integer>> entry : result.entrySet()) {
                List<Integer> daySpots = entry.getValue();

                boolean hasIsland = daySpots.stream()
                        .anyMatch(id -> spotMap.containsKey(id) && spotMap.get(id).isIsland());

                if (!hasIsland && !spillover.isEmpty()) {
                    daySpots.addAll(spillover);
                    spillover.clear();
                    break;
                }
            }

            // 여전히 남아있으면 새 Day 생성
            if (!spillover.isEmpty()) {
                int newDay = result.keySet().stream().max(Integer::compare).orElse(0) + 1;
                result.put(newDay, new ArrayList<>(spillover));
                log.info("새 Day {} 생성 (spillover)", newDay);
            }
        }

        return result;
    }

    // 일정 다듬기 응답 파싱
    private List<DayScheduleDto> parseRefinementResponse(String gptResponse, List<DayScheduleDto> originalDays) {
        try {
            // 현재는 원본 반환
            log.warn("일정 다듬기 파싱 미구현 - 원본 반환");
            return originalDays;

        } catch (Exception e) {
            log.error("GPT 응답 파싱 실패: {}", e.getMessage());
            return originalDays;
        }
    }

    // JSON 추출 (마크다운 제거)
    private String extractJson(String text) {
        // ```json ... ``` 제거
        text = text.replaceAll("```json\\s*", "");
        text = text.replaceAll("```\\s*", "");
        return text.trim();
    }

    // 기본 분배 전략 (GPT 실패 시)
    private DayDistributionDto createDefaultDistribution(List<TouristSpot> allSpots, int travelDays) {
        log.warn("GPT 실패 - 기본 분배 전략 사용");

        // 간단한 균등 분배
        List<Integer> selectedIds = allSpots.stream()
                .map(TouristSpot::getSpotId)
                .toList();

        Map<Integer, List<Integer>> dayGroups = new HashMap<>();
        int spotsPerDay = selectedIds.size() / travelDays;

        int startIndex = 0;
        for (int day = 1; day <= travelDays; day++) {
            int endIndex = Math.min(startIndex + spotsPerDay, selectedIds.size());
            dayGroups.put(day, new ArrayList<>(selectedIds.subList(startIndex, endIndex)));
            startIndex = endIndex;
        }

        return DayDistributionDto.builder()
                .selectedSpots(selectedIds)
                .excludedSpots(new ArrayList<>())
                .excludeReason("기본 분배")
                .dayGroups(dayGroups)
                .build();
    }


    private List<DayScheduleDto> ensureMealTimes(List<DayScheduleDto> days) {
        for (DayScheduleDto day : days) {
            List<ScheduleItemDto> items = day.getItems();
            boolean hasLunch = items.stream()
                    .anyMatch(item -> item.getType().equals("MEAL") &&
                            item.getArrivalTime().getHour() >= 11 &&
                            item.getArrivalTime().getHour() <= 14);

            boolean hasDinner = items.stream()
                    .anyMatch(item -> item.getType().equals("MEAL") &&
                            item.getArrivalTime().getHour() >= 17 &&
                            item.getArrivalTime().getHour() <= 20);

            // 점심 없으면 추가
            if (!hasLunch) {
                ScheduleItemDto lunch = createMealItem("점심 식사", 12, 0, 60);
                insertMealAtAppropriateTime(items, lunch);
            }

            // 저녁 없으면 추가
            if (!hasDinner) {
                ScheduleItemDto dinner = createMealItem("저녁 식사", 18, 0, 60);
                insertMealAtAppropriateTime(items, dinner);
            }

            // 시간 재계산
            recalculateTimes(day);
        }
        return days;
    }

    private ScheduleItemDto createMealItem(String name, int hour, int minute, int duration) {
        return ScheduleItemDto.builder()
                .type("MEAL")
                .name(name)
                .arrivalTime(LocalTime.of(hour, minute))
                .departureTime(LocalTime.of(hour, minute).plusMinutes(duration))
                .duration(duration)
                .cost(15000)  // 평균 식사비
                .build();
    }

    private void insertMealAtAppropriateTime(List<ScheduleItemDto> items, ScheduleItemDto meal) {
        // meal.arrivalTime에 가장 가까운 시간에 삽입
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).getDepartureTime().isAfter(meal.getArrivalTime())) {
                items.add(i, meal);
                return;
            }
        }
        items.add(meal);  // 맨 끝에 추가
    }

    private void recalculateTimes(DayScheduleDto day) {
        LocalTime currentTime = day.getStartTime();

        for (ScheduleItemDto item : day.getItems()) {
            item.setArrivalTime(currentTime);
            item.setDepartureTime(currentTime.plusMinutes(item.getDuration()));
            currentTime = item.getDepartureTime();
        }

        day.setEndTime(currentTime);
    }
}