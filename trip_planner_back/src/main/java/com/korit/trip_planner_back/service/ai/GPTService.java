package com.korit.trip_planner_back.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * GPT API 호출 전담 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GPTService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * GPT API 호출
     *
     * @param prompt 프롬프트
     * @return GPT 응답 텍스트
     */
    public String callGptApi(String prompt) throws Exception {
        log.info("=== GPT API 호출 시작 ===");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("temperature", 0.3);  // 일관된 결과
        requestBody.put("max_tokens", 2000);

        // 메시지 구성
        List<Map<String, String>> messages = new ArrayList<>();

        // System message
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content",
                "You are a professional Jeju travel planner. " +
                        "CRITICAL RULES: " +
                        "1. ALL days (day1 to dayN) MUST have at least 1 spot. " +
                        "2. Island spots: maximum 1 per day. " +
                        "3. NEVER mix 동부 (longitude >= 126.7) and 서부 (longitude < 126.3) in same day. " +
                        "4. Try to distribute spots EVENLY across days (3-5 spots per day is ideal). " +
                        "5. Don't put too many spots on one day and too few on others. " +
                        "6. Response MUST be pure JSON only, no markdown, no explanation."
        );
                ;
        messages.add(systemMessage);

        // User message
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);

        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            String content = root.path("choices").get(0)
                    .path("message").path("content").asText();

            log.info("GPT API 응답 수신: {} chars", content.length());
            log.debug("GPT 응답 내용:\n{}", content);

            return content;

        } catch (Exception e) {
            log.error("GPT API 호출 실패: {}", e.getMessage(), e);
            throw new RuntimeException("GPT API 호출 실패", e);
        }
    }
}