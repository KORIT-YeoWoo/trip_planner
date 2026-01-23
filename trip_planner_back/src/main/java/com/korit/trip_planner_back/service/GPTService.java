package com.korit.trip_planner_back.service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
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

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(JsonParser.Feature.ALLOW_COMMENTS, true)
            .configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true)
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    /* =========================
       ✅ 메인 진입점: GPT 1차 - 관광지 필터링 + Day 그룹핑
       ========================= */
    public DayDistributionDto filterAndGroupSpots(
            List<TouristSpot> allSpots,
            int travelDays,
            List<DailyLocationDto> dailyLocations,
            String transport) {

        log.info("GPT 필터링 시작: 관광지 {}개 → {}박{}일",
                allSpots.size(), travelDays - 1, travelDays);

        try {
            // 1. 프롬프트 생성
            String prompt = buildFilteringPrompt(allSpots, travelDays, dailyLocations, transport);

            // 2. 프롬프트 로그
            log.info("=== GPT에게 보내는 프롬프트 ===");
            log.info("{}", prompt);
            log.info("==============================");

            // 3. GPT API 호출
            String gptResponse = callGptApi(prompt);

            // 4. 응답 파싱 (travelDays 전달!)
            DayDistributionDto result = parseDistributionResponse(gptResponse, allSpots, travelDays);

            // 5. excludedSpots 계산 (GPT가 안 줬으면 직접 계산)
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
            return createDefaultDistribution(allSpots, travelDays);
        }
    }

    /* =========================
       ✅ GPT 1차 프롬프트: 필터링 + 그룹핑
       ========================= */
    private String buildFilteringPrompt(
            List<TouristSpot> allSpots,
            int travelDays,
            List<DailyLocationDto> dailyLocations,
            String transport) {

        StringBuilder sb = new StringBuilder();

        sb.append("⚠️⚠️⚠️ 가장 중요한 규칙 ⚠️⚠️⚠️\n");
        sb.append("dayDistribution의 day").append(travelDays).append("는 절대 비워두지 마세요!\n");
        sb.append("day1부터 day").append(travelDays).append("까지 모두 최소 1개 이상 포함!\n");
        sb.append("빈 배열 [] 하면 오류입니다!\n\n");


        sb.append("""
                당신은 제주도 여행 일정 최적화 전문가입니다.
                
                ⚠️⚠️⚠️ 핵심 원칙 ⚠️⚠️⚠️
                1. 사용자는 여행을 즐기러 왔습니다. 관광지를 최대한 많이 방문하는 것이 목표입니다.
                2. 빠르게 끝내는 것이 아니라, 여유롭게 즐기는 일정을 만드세요.
                3. 제외는 정말 불가능한 경우에만 하세요.
                4. 모든 날짜를 균등하게 채우세요. 특정 날에 몰아넣지 마세요.
                5. **day""\").append(travelDays).append("도 반드시 채우세요!**\\n");
                
                응답은 반드시 순수 JSON 형식만 반환하세요.
                """);

        // ✅ 여행 정보
        sb.append("### 여행 정보\n");
        sb.append("- 기간: ").append(travelDays - 1).append("박").append(travelDays).append("일\n");
        sb.append("- 총 여행 일수: ").append(travelDays).append("일\n");
        sb.append("- 교통: ").append(transport).append("\n\n");

        // ✅ 제주도 지역 구분
        sb.append("### 제주도 지역 구분\n");
        sb.append("- 동부: 구좌읍, 성산, 세화 (경도 126.7 이상)\n");
        sb.append("- 서부: 한림, 협재, 한경 (경도 126.3 미만)\n");
        sb.append("- 북부: 공항, 제주시 (위도 33.45 이상)\n");
        sb.append("- 남부: 서귀포, 중문 (위도 33.3 미만)\n");
        sb.append("- 중부: 1100도로, 송당 (나머지)\n\n");

        // ✅ 각 날짜별 동선
        sb.append("### 각 날짜별 동선\n");
        for (DailyLocationDto dayLoc : dailyLocations) {
            sb.append("- Day ").append(dayLoc.getDay()).append(": ")
                    .append(dayLoc.getStartName())
                    .append(" (").append(getRegion(dayLoc.getStartLat(), dayLoc.getStartLon())).append(")")
                    .append(" → ... → ")
                    .append(dayLoc.getEndName())
                    .append(" (").append(getRegion(dayLoc.getEndLat(), dayLoc.getEndLon())).append(")")
                    .append("\n");
        }
        sb.append("\n");

        // ✅ 관광지 정보

        sb.append("### 선택 가능한 관광지 (").append(allSpots.size()).append("개)\n");
        for (TouristSpot spot : allSpots) {
            String region = getRegion(spot.getLatitude(), spot.getLongitude());

            sb.append("- ID:").append(spot.getSpotId())
                    .append(" | ").append(spot.getTitle())
                    .append(" | 🔴지역:").append(region)  // 강조!
                    .append(" (위도:").append(String.format("%.2f", spot.getLatitude()))
                    .append(", 경도:").append(String.format("%.2f", spot.getLongitude())).append(")")
                    .append(" | 카테고리:").append(spot.getCategory());

            if (spot.getSpotDuration() > 0) {
                sb.append(" | 소요:").append(spot.getSpotDuration()).append("분");
            }

            if (spot.isIsland()) {
                sb.append(" | ⭐섬(페리 포함 6시간)");
            }
            sb.append("\n");
        }
        sb.append("\n");

        // 🔥 관광지 선택 원칙
        sb.append("### ⚠️⚠️⚠️ 관광지 선택 원칙 ⚠️⚠️⚠️\n");
        sb.append("1. **가능한 한 많이 선택하세요!** 사용자가 선택한 관광지는 모두 가고 싶어하는 곳입니다.\n");
        sb.append("2. 제외는 최소한으로! 다음 경우에만 제외:\n");
        sb.append("   - 물리적으로 반대편 (동부↔서부)이고 같은 날 배치 불가능\n");
        sb.append("   - 출발/도착 지점에서 1시간 30분 이상 걸려서 일정에 맞지 않음\n");
        sb.append("   - 섬이 2개 이상이고 하루에 모두 방문 불가능\n");
        sb.append("3. **제외 개수는 최대 ").append(Math.max(1, allSpots.size() / 4)).append("개까지만!**\n\n");

        // 🔥 Day 분배 원칙
        sb.append("### 📋 Day 분배 원칙 (매우 중요!)\n");
        sb.append("1. **모든 날짜를 균등하게 채우세요!**\n");
        sb.append("   - ").append(travelDays).append("일이면 하루 평균 ")
                .append(allSpots.size() / travelDays).append("개씩 배분\n");
        sb.append("2. 각 Day의 출발지/도착지와 같은 지역 우선\n");
        sb.append("3. 🚨🚨🚨 **절대 규칙: 동부(경도 126.7↑) ↔ 서부(경도 126.3↓)는 같은 날 절대 금지!** 🚨🚨🚨\n");
        sb.append("   - 예시: 동부 관광지와 서부 관광지를 같은 날에 넣으면 안됨!\n");
        sb.append("   - 이유: 1시간 이상 거리로 너무 멀어서 비효율적\n");
        sb.append("4. 섬은 하루에 1개만\n\n");

        // 🔥 하루 관광지 개수
        sb.append("### 📋 하루 관광지 개수 (권장)\n");
        sb.append("- 섬 있는 날: 3~4개\n");
        sb.append("- 섬 없는 날: 4~6개\n");
        sb.append("- **중요: 이 숫자는 권장사항입니다. 모든 관광지를 소화하기 위해 조정 가능합니다.**\n\n");

        // ✅ 절대 규칙
        sb.append("### ⚠️⚠️⚠️ 절대 규칙 - 반드시 지켜야 함 ⚠️⚠️⚠️\n");
        sb.append("1. 총 여행 일수: ").append(travelDays).append("일\n");
        sb.append("2. dayDistribution은 반드시 day1부터 day").append(travelDays).append("까지 모두 포함!\n");
        sb.append("3. **각 날짜는 거의 비슷한 개수로 배정!** 특정 날에 몰아넣지 마세요!\n");
        sb.append("4. 빈 날짜 절대 금지!\n\n");

        // ✅ 응답 형식
        sb.append("### ⚠️ 응답 형식 ⚠️\n");
        sb.append("반드시 순수 JSON만! 설명/인사/마크다운 금지\n\n");

        // 🔥 올바른 예시
        sb.append("### ✅ 올바른 예시 (").append(allSpots.size()).append("개 중 ")
                .append(Math.max(allSpots.size() - 2, 1)).append("개 선택)\n");
        sb.append("{\n");
        sb.append("  \"selectedSpots\": [대부분의 관광지 ID],\n");
        sb.append("  \"excludedSpots\": [1~2개만],\n");
        sb.append("  \"excludeReason\": \"정말 불가피한 이유\",\n");
        sb.append("  \"dayDistribution\": {\n");

        int avgPerDay = allSpots.size() / travelDays;
        for (int i = 1; i <= travelDays; i++) {
            sb.append("    \"day").append(i).append("\": [약 ")
                    .append(avgPerDay).append("개의 관광지]");
            if (i < travelDays) sb.append(",");
            sb.append("  // ").append(i).append("일차 - 균등 배분!\n");
        }

        sb.append("  }\n");
        sb.append("}\n\n");

        // 🔥 잘못된 예시
        sb.append("### ❌ 잘못된 예시 (이렇게 하지 마세요!)\n");
        sb.append("{\n");
        sb.append("  \"selectedSpots\": [1, 2, 3, 4],  // ❌ 너무 적음!\n");
        sb.append("  \"excludedSpots\": [5, 6, 7, 8, 9, 10],  // ❌ 너무 많이 제외!\n");
        sb.append("  \"dayDistribution\": {\n");
        sb.append("    \"day1\": [1, 2, 3],  // ❌ 불균등!\n");
        sb.append("    \"day2\": [4],\n");
        sb.append("    \"day3\": []\n");
        sb.append("  }\n");
        sb.append("}\n");

        return sb.toString();
    }

    /* =========================
       ✅ GPT 2차: 최종 다듬기
       ========================= */
    public List<DayScheduleDto> refineSchedule(List<DayScheduleDto> days) {
        log.info("GPT 일정 다듬기 시작: {}일", days.size());

        try {
            String prompt = buildRefinementPrompt(days);
            String gptResponse = callGptApi(prompt);
            List<DayScheduleDto> refined = parseRefinementResponse(gptResponse, days);

            log.info("GPT 일정 다듬기 완료");
            return refined;

        } catch (Exception e) {
            log.error("GPT 일정 다듬기 실패: {}", e.getMessage(), e);
            return days;
        }
    }

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

        sb.append("\n### ⭐ 필수 요청사항\n");
        sb.append("1. 점심시간 (12:00~13:00)에 반드시 식사 추가\n");
        sb.append("2. 저녁시간 (18:00~19:00)에 반드시 식사 추가\n");
        sb.append("3. 하루 일정이 최소 18:00까지는 진행되도록 조정\n");
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
        sb.append("        }\n");
        sb.append("      ]\n");
        sb.append("    }\n");
        sb.append("  ]\n");
        sb.append("}\n");

        return sb.toString();
    }

    /* =========================
       ✅ GPT API 호출
       ========================= */
    private String callGptApi(String prompt) throws Exception {
        log.info("GPT API 호출 시작");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);

        // 🆕 System message 추가 (최우선 규칙)
        List<Map<String, String>> messages = new ArrayList<>();

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content",
                "You are a Jeju travel expert. CRITICAL RULES: " +
                        "1. dayDistribution MUST include ALL days from day1 to dayN. NEVER leave any day empty. " +
                        "2. NEVER mix 동부 (longitude >= 126.7) and 서부 (longitude < 126.3) spots in the same day. " +
                        "3. Distribute spots EVENLY across all days."
        );
        messages.add(systemMessage);

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);

        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.3);
        requestBody.put("max_tokens", 2000);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        JsonNode root = objectMapper.readTree(response.getBody());
        String content = root.path("choices").get(0).path("message").path("content").asText();

        log.info("GPT API 응답 수신: {} chars", content.length());

        return content;
    }
    /* =========================
       ✅ GPT 응답 파싱 (핵심 - 완전 수정 버전)
       ========================= */
    private DayDistributionDto parseDistributionResponse(
            String gptResponse,
            List<TouristSpot> allSpots,
            int travelDays) {

        try {
            log.info("=== GPT 원본 응답 ===");
            log.info("{}", gptResponse);
            log.info("===================");

            String jsonStr = extractJson(gptResponse);

            log.info("=== 추출된 JSON ===");
            log.info("{}", jsonStr);
            log.info("==================");

            JsonNode root = objectMapper.readTree(jsonStr);

            // selectedSpots
            List<Integer> selectedIds = new ArrayList<>();
            root.path("selectedSpots").forEach(node -> selectedIds.add(node.asInt()));

            // excludedSpots
            List<Integer> excludedIds = new ArrayList<>();
            root.path("excludedSpots").forEach(node -> excludedIds.add(node.asInt()));

            String excludeReason = root.path("excludeReason").asText("");

            // 🔥 서버 기준 Day 틀 생성 (travelDays만큼만!)
            Map<Integer, List<Integer>> dayGroups = new LinkedHashMap<>();
            for (int day = 1; day <= travelDays; day++) {
                dayGroups.put(day, new ArrayList<>());
            }

            // GPT 응답 반영
            JsonNode dayDist = root.path("dayDistribution");
            if (!dayDist.isMissingNode() && dayDist.isObject()) {
                for (int day = 1; day <= travelDays; day++) {
                    String dayKey = "day" + day;
                    if (dayDist.has(dayKey)) {
                        JsonNode dayNode = dayDist.get(dayKey);
                        for (JsonNode node : dayNode) {
                            dayGroups.get(day).add(node.asInt());
                        }
                    }
                }
            } else {
                log.warn("dayDistribution 없음 - 균등 분배로 fallback");
                dayGroups = createEvenDistribution(selectedIds, travelDays);
            }

            // 미배정 관광지 계산
            Set<Integer> assigned = dayGroups.values().stream()
                    .flatMap(List::stream)
                    .collect(Collectors.toSet());

            List<Integer> unassigned = selectedIds.stream()
                    .filter(id -> !assigned.contains(id))
                    .collect(Collectors.toList());

            // 🔥 빈 Day 최소 1개 보장
            for (int day = 1; day <= travelDays && !unassigned.isEmpty(); day++) {
                if (dayGroups.get(day).isEmpty()) {
                    Integer spotId = unassigned.remove(0);
                    dayGroups.get(day).add(spotId);
                    log.info("Day {} 비어있음 → 관광지 {} 자동 배정", day, spotId);
                }
            }

            // 🔥 남은 미배정 관광지 라운드 로빈 재배치
            int day = 1;
            while (!unassigned.isEmpty()) {
                dayGroups.get(day).add(unassigned.remove(0));
                day = (day % travelDays) + 1;
            }

            log.info("검증 완료 - 선택: {}, Day 수: {}", selectedIds.size(), dayGroups.size());

            // 🔥 섬 분리 (Day 초과 생성 금지!)
            dayGroups = separateIslandsSafely(dayGroups, allSpots, travelDays);

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

    /* =========================
       ✅ 섬 하루 1개 제한 (Day 초과 생성 금지!)
       ========================= */
    private Map<Integer, List<Integer>> separateIslandsSafely(
            Map<Integer, List<Integer>> dayGroups,
            List<TouristSpot> allSpots,
            int travelDays) {

        Map<Integer, TouristSpot> spotMap = allSpots.stream()
                .collect(Collectors.toMap(TouristSpot::getSpotId, spot -> spot));

        List<Integer> overflow = new ArrayList<>();

        for (int day = 1; day <= travelDays; day++) {
            List<Integer> daySpots = dayGroups.get(day);

            // 섬 확인
            List<Integer> islands = new ArrayList<>();
            for (Integer id : daySpots) {
                if (spotMap.containsKey(id) && spotMap.get(id).isIsland()) {
                    islands.add(id);
                }
            }

            if (islands.size() > 1) {
                // 첫 번째 섬만 유지
                Integer keepIsland = islands.get(0);
                log.warn("Day {} 섬 {}개 감지 - {} 유지, 나머지 재배치", day, islands.size(), keepIsland);

                // 나머지 섬들은 overflow로
                for (int i = 1; i < islands.size(); i++) {
                    overflow.add(islands.get(i));
                }

                // 첫 번째 섬 + 일반 관광지 2개까지만 유지
                List<Integer> kept = new ArrayList<>();
                kept.add(keepIsland);

                int count = 0;
                for (Integer id : daySpots) {
                    if (!islands.contains(id) && count < 2) {
                        kept.add(id);
                        count++;
                    }
                }

                // 나머지는 overflow
                for (Integer id : daySpots) {
                    if (!kept.contains(id)) {
                        overflow.add(id);
                    }
                }

                dayGroups.put(day, kept);

            } else if (!islands.isEmpty() && daySpots.size() > 3) {
                // 섬 1개 + 일반 관광지가 너무 많으면 3개로 제한
                log.warn("Day {} 섬 있는 날 관광지 {}개 → 3개로 제한", day, daySpots.size());

                List<Integer> kept = new ArrayList<>();
                kept.add(islands.get(0));

                int count = 0;
                for (Integer id : daySpots) {
                    if (!islands.contains(id) && count < 2) {
                        kept.add(id);
                        count++;
                    }
                }

                // 나머지는 overflow
                for (Integer id : daySpots) {
                    if (!kept.contains(id)) {
                        overflow.add(id);
                    }
                }

                dayGroups.put(day, kept);
            }
        }

        // 🔥 overflow를 다른 Day에 라운드 로빈 재배치 (Day 초과 생성 금지!)
        if (!overflow.isEmpty()) {
            log.info("overflow {}개 재배치", overflow.size());

            int currentDay = 1;
            for (Integer spotId : overflow) {
                // 섬 없는 날 우선 배치
                boolean placed = false;
                for (int d = 1; d <= travelDays; d++) {
                    List<Integer> daySpots = dayGroups.get(d);
                    boolean hasIsland = false;
                    for (Integer id : daySpots) {
                        if (spotMap.containsKey(id) && spotMap.get(id).isIsland()) {
                            hasIsland = true;
                            break;
                        }
                    }

                    if (!hasIsland && daySpots.size() < 5) {
                        dayGroups.get(d).add(spotId);
                        placed = true;
                        break;
                    }
                }

                // 섬 없는 날이 없으면 라운드 로빈
                if (!placed) {
                    dayGroups.get(currentDay).add(spotId);
                    currentDay = (currentDay % travelDays) + 1;
                }
            }
        }

        return dayGroups;
    }

    /* =========================
       ✅ 균등 분배 (fallback)
       ========================= */
    private Map<Integer, List<Integer>> createEvenDistribution(List<Integer> spotIds, int travelDays) {
        Map<Integer, List<Integer>> dayGroups = new LinkedHashMap<>();

        int spotsPerDay = spotIds.size() / travelDays;
        int remainder = spotIds.size() % travelDays;

        int startIndex = 0;
        for (int day = 1; day <= travelDays; day++) {
            int daySpotCount = spotsPerDay + (day <= remainder ? 1 : 0);
            int endIndex = Math.min(startIndex + daySpotCount, spotIds.size());

            dayGroups.put(day, new ArrayList<>(spotIds.subList(startIndex, endIndex)));
            startIndex = endIndex;
        }

        return dayGroups;
    }

    /* =========================
       ✅ JSON 추출
       ========================= */
    private String extractJson(String text) {
        try {
            int jsonStart = text.indexOf("```json");
            int jsonEnd = text.indexOf("```", jsonStart + 7);

            if (jsonStart != -1 && jsonEnd != -1) {
                text = text.substring(jsonStart + 7, jsonEnd).trim();
            } else {
                text = text.replaceAll("```json\\s*", "")
                        .replaceAll("```\\s*", "")
                        .trim();
            }

            int firstBrace = text.indexOf('{');
            int lastBrace = text.lastIndexOf('}');

            if (firstBrace == -1 || lastBrace == -1 || firstBrace >= lastBrace) {
                throw new RuntimeException("JSON 형식을 찾을 수 없습니다");
            }

            return text.substring(firstBrace, lastBrace + 1);

        } catch (Exception e) {
            log.error("JSON 추출 실패 - 원본: {}",
                    text.substring(0, Math.min(500, text.length())));
            throw new RuntimeException("JSON 추출 실패", e);
        }
    }

    /* =========================
       ✅ 지역 판별
       ========================= */
    private String getRegion(double lat, double lon) {
        if (lat >= 33.45 && lon >= 126.7) return "동부";
        if (lat >= 33.45 && lon < 126.3) return "서부";
        if (lat >= 33.45) return "북부";
        if (lat < 33.3 && lon < 126.3) return "남서부";
        if (lat < 33.3) return "남부";
        return "중부";
    }

    /* =========================
       ✅ 제외된 관광지 계산
       ========================= */
    private List<Integer> calculateExcludedSpots(List<TouristSpot> allSpots, List<Integer> selectedIds) {
        Set<Integer> selectedSet = new HashSet<>(selectedIds);

        return allSpots.stream()
                .map(TouristSpot::getSpotId)
                .filter(id -> !selectedSet.contains(id))
                .collect(Collectors.toList());
    }

    /* =========================
       ✅ 기본 분배 전략 (GPT 실패 시)
       ========================= */
    private DayDistributionDto createDefaultDistribution(List<TouristSpot> allSpots, int travelDays) {
        log.warn("GPT 실패 - 기본 분배 전략 사용");

        List<Integer> selectedIds = allSpots.stream()
                .map(TouristSpot::getSpotId)
                .toList();

        Map<Integer, List<Integer>> dayGroups = createEvenDistribution(selectedIds, travelDays);

        return DayDistributionDto.builder()
                .selectedSpots(selectedIds)
                .excludedSpots(new ArrayList<>())
                .excludeReason("기본 분배")
                .dayGroups(dayGroups)
                .build();
    }

    /* =========================
       ✅ 일정 다듬기 응답 파싱 (미구현)
       ========================= */
    private List<DayScheduleDto> parseRefinementResponse(String gptResponse, List<DayScheduleDto> originalDays) {
        log.warn("일정 다듬기 파싱 미구현 - 원본 반환");
        return originalDays;
    }

    /* =========================
       ✅ 식사 시간 보장 (미사용)
       ========================= */
    @SuppressWarnings("unused")
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

            if (!hasLunch) {
                ScheduleItemDto lunch = createMealItem("점심 식사", 12, 0, 60);
                insertMealAtAppropriateTime(items, lunch);
            }

            if (!hasDinner) {
                ScheduleItemDto dinner = createMealItem("저녁 식사", 18, 0, 60);
                insertMealAtAppropriateTime(items, dinner);
            }

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
                .cost(15000)
                .build();
    }

    private void insertMealAtAppropriateTime(List<ScheduleItemDto> items, ScheduleItemDto meal) {
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).getDepartureTime().isAfter(meal.getArrivalTime())) {
                items.add(i, meal);
                return;
            }
        }
        items.add(meal);
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