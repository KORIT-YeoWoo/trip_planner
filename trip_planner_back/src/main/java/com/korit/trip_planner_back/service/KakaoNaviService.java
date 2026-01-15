package com.korit.trip_planner_back.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Service
public class KakaoNaviService {

    private static final String KAKAO_NAVI_API_URL = "https://apis-navi.kakaomobility.com/v1/directions";

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public KakaoNaviService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public RouteInfo getRouteInfo(double originLat, double originLon,
                                  double destLat, double destLon) {
        try {
            // URL 생성
            String url = UriComponentsBuilder.fromHttpUrl(KAKAO_NAVI_API_URL)
                    .queryParam("origin", String.format("%f,%f", originLon, originLat))
                    .queryParam("destination", String.format("%f,%f", destLon, destLat))
                    .queryParam("priority", "RECOMMEND")  // 추천 경로
                    .build()
                    .toUriString();

            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoRestApiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // API 호출
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            // 응답 파싱
            return parseResponse(response.getBody());

        } catch (Exception e) {
            log.error("카카오 네비 API 호출 실패: {} -> {}",
                    String.format("%.4f,%.4f", originLat, originLon),
                    String.format("%.4f,%.4f", destLat, destLon),
                    e);
            return null;
        }
    }

    private RouteInfo parseResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode routes = root.get("routes");

            if (routes == null || routes.isEmpty()) {
                log.warn("경로를 찾을 수 없습니다: {}", responseBody);
                return null;
            }

            JsonNode summary = routes.get(0).get("summary");

            int distanceInMeters = summary.get("distance").asInt();
            int durationInSeconds = summary.get("duration").asInt();

            // 킬로미터, 분 단위로 변환
            double distanceInKm = distanceInMeters / 1000.0;
            int durationInMinutes = (int) Math.ceil(durationInSeconds / 60.0);

            return new RouteInfo(distanceInKm, durationInMinutes);

        } catch (Exception e) {
            log.error("응답 파싱 실패: {}", responseBody, e);
            return null;
        }
    }

    public static class RouteInfo {
        private final double distance;  // km
        private final int duration;     // 분

        public RouteInfo(double distance, int duration) {
            this.distance = distance;
            this.duration = duration;
        }

        public double getDistance() {
            return distance;
        }

        public int getDuration() {
            return duration;
        }

        public double getAverageSpeed() {
            if (duration == 0) return 0;
            return (distance / duration) * 60;
        }

        @Override
        public String toString() {
            return String.format("%.1fkm, %d분 (평균 %.1fkm/h)",
                    distance, duration, getAverageSpeed());
        }
    }
}