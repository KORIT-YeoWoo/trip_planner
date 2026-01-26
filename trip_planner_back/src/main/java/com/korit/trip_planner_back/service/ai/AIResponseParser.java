package com.korit.trip_planner_back.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korit.trip_planner_back.dto.ai.AIScheduleResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * GPT 응답 파싱
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AIResponseParser {

    private final ObjectMapper objectMapper;

    /**
     * GPT 응답 → AIScheduleResponse 파싱
     */
    public AIScheduleResponse parse(String gptResponse, int travelDays) {
        try {
            log.info("=== GPT 응답 파싱 시작 ===");

            // 1. JSON 추출 (마크다운 제거)
            String jsonStr = extractJson(gptResponse);

            log.info("GPT 원본 응답:\n{}", gptResponse);
            log.debug("추출된 JSON:\n{}", jsonStr);

            // 2. JSON → DTO
            JsonNode root = objectMapper.readTree(jsonStr);

            // days 파싱
            List<AIScheduleResponse.DaySchedule> days = new ArrayList<>();
            JsonNode daysNode = root.path("days");

            if (daysNode.isArray()) {
                for (JsonNode dayNode : daysNode) {
                    days.add(parseDaySchedule(dayNode));
                }
            }

            // excluded 파싱
            List<Integer> excluded = new ArrayList<>();
            JsonNode excludedNode = root.path("excluded");
            if (excludedNode.isArray()) {
                excludedNode.forEach(node -> excluded.add(node.asInt()));
            }

            String excludeReason = root.path("excludeReason").asText("");

            // 3. 검증
            validateResponse(days, travelDays);

            log.info("GPT 응답 파싱 완료: {}일, 제외 {}개", days.size(), excluded.size());

            return AIScheduleResponse.builder()
                    .days(days)
                    .excluded(excluded)
                    .excludeReason(excludeReason)
                    .build();

        } catch (Exception e) {
            log.error("GPT 응답 파싱 실패: {}", e.getMessage(), e);
            throw new RuntimeException("GPT 응답 파싱 실패", e);
        }
    }

    /**
     * JSON 추출 (마크다운 제거)
     */
    private String extractJson(String text) {
        // ```json ... ``` 제거
        int jsonStart = text.indexOf("```json");
        int jsonEnd = text.indexOf("```", jsonStart + 7);

        if (jsonStart != -1 && jsonEnd != -1) {
            text = text.substring(jsonStart + 7, jsonEnd).trim();
        } else {
            text = text.replaceAll("```json\\s*", "")
                    .replaceAll("```\\s*", "")
                    .trim();
        }

        // 첫 { 부터 마지막 } 까지
        int firstBrace = text.indexOf('{');
        int lastBrace = text.lastIndexOf('}');

        if (firstBrace == -1 || lastBrace == -1) {
            throw new RuntimeException("JSON 형식을 찾을 수 없습니다");
        }

        return text.substring(firstBrace, lastBrace + 1);
    }

    /**
     * DaySchedule 파싱
     */
    private AIScheduleResponse.DaySchedule parseDaySchedule(JsonNode dayNode) {
        int day = dayNode.path("day").asInt();
        String reasoning = dayNode.path("reasoning").asText("");

        List<AIScheduleResponse.ScheduleItem> items = new ArrayList<>();
        JsonNode itemsNode = dayNode.path("items");

        if (itemsNode.isArray()) {
            for (JsonNode itemNode : itemsNode) {
                items.add(parseScheduleItem(itemNode));
            }
        }

        return AIScheduleResponse.DaySchedule.builder()
                .day(day)
                .items(items)
                .reasoning(reasoning)
                .build();
    }

    /**
     * ScheduleItem 파싱
     */
    private AIScheduleResponse.ScheduleItem parseScheduleItem(JsonNode itemNode) {
        String type = itemNode.path("type").asText("");

        AIScheduleResponse.ScheduleItem.ScheduleItemBuilder builder =
                AIScheduleResponse.ScheduleItem.builder()
                        .type(type)
                        .name(itemNode.path("name").asText(""));

        if ("SPOT".equals(type)) {
            builder.spotId(itemNode.path("spotId").asInt());

            // reason은 선택
            if (itemNode.has("reason") && !itemNode.path("reason").isNull()) {
                builder.reason(itemNode.path("reason").asText());
            }
        } else if ("MEAL".equals(type)) {
            builder.suggestedTime(itemNode.path("suggestedTime").asText("12:00"));
            builder.duration(itemNode.path("duration").asInt(60));
        }

        return builder.build();
    }

    /**
     * 응답 검증
     */
    private void validateResponse(List<AIScheduleResponse.DaySchedule> days, int expectedDays) {
        if (days.size() != expectedDays) {
            log.warn("⚠️ 날짜 수 불일치: 기대 {}일, 실제 {}일", expectedDays, days.size());
        }

        // 모든 날짜에 최소 1개 SPOT 있는지 확인
        for (AIScheduleResponse.DaySchedule day : days) {
            long spotCount = day.getItems().stream()
                    .filter(item -> "SPOT".equals(item.getType()))
                    .count();

            if (spotCount == 0) {
                throw new RuntimeException(
                        "Day " + day.getDay() + "에 관광지가 없습니다 (Hard Constraint 위반)");
            }
        }
    }
}