package com.korit.trip_planner_back.service.ai;

import com.korit.trip_planner_back.dto.request.DailyLocationDto;
import com.korit.trip_planner_back.entity.TouristSpot;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class PromptBuilder {

    /**
     * AI 일정 생성 프롬프트
     */
    public String buildSchedulePrompt(
            List<TouristSpot> spots,
            List<DailyLocationDto> dailyLocations,
            int travelDays,
            String transport) {

        StringBuilder sb = new StringBuilder();

        int totalSpots = spots.size();
        int minPerDay = Math.max(1, totalSpots / travelDays - 1);  // 최소값
        int maxPerDay = Math.min(6, (int) Math.ceil((double) totalSpots / travelDays) + 1);  // 최대값

        sb.append("당신은 제주도 여행 플래너입니다.\n\n");

        // 기본 정보
        sb.append("### 입력 정보\n");
        sb.append("- 여행 기간: ").append(travelDays - 1).append("박").append(travelDays).append("일\n");
        sb.append("- 이동 수단: ").append(transport).append("\n");
        sb.append("- 총 관광지: ").append(totalSpots).append("개\n\n");

        // ✅ 명확한 분배 가이드
        sb.append("### 📋 관광지 분배 가이드\n");
        sb.append("**중요: 아래 분배 가이드를 반드시 따라야 합니다!**\n");

        int remaining = totalSpots;
        for (int i = 1; i <= travelDays; i++) {
            int recommended = Math.min(6, (int) Math.ceil((double) remaining / (travelDays - i + 1)));
            sb.append("- Day ").append(i).append(": ").append(recommended).append("개 권장\n");
            remaining -= recommended;
        }
        sb.append("\n");

        // 관광지 정보
        sb.append("### 선택한 관광지 (총 ").append(spots.size()).append("개)\n");
        for (TouristSpot spot : spots) {
            sb.append("- [").append(spot.getSpotId()).append("] ")
                    .append(spot.getTitle())
                    .append(" (");

            // 위치 정보
            String region = getRegion(spot.getLatitude(), spot.getLongitude());
            sb.append("지역: ").append(region);

            // 섬 여부
            if (spot.isIsland()) {
                sb.append(", ⭐섬 - 페리 포함 약 6시간 소요");
            }

            // 체류 시간
            if (spot.getSpotDuration() > 0) {
                sb.append(", 소요: ").append(spot.getSpotDuration()).append("분");
            }

            sb.append(")\n");
        }
        sb.append("\n");

        // 각 날짜 동선
        sb.append("### 각 날짜 출발/도착 위치\n");
        for (int i = 0; i < dailyLocations.size(); i++) {
            DailyLocationDto loc = dailyLocations.get(i);
            sb.append("- Day ").append(i + 1).append(": ")
                    .append(loc.getStartName())
                    .append(" (").append(getRegion(loc.getStartLat(), loc.getStartLon())).append(")")
                    .append(" → ")
                    .append(loc.getEndName())
                    .append(" (").append(getRegion(loc.getEndLat(), loc.getEndLon())).append(")")
                    .append("\n");
        }
        sb.append("\n");

        // 요청사항
        sb.append("### 요청사항\n");
        sb.append("1. **위의 분배 가이드에 따라** 각 날짜에 관광지를 배정\n");
        sb.append("2. 각 관광지의 방문 순서 제안\n");
        sb.append("   - 특별한 이유가 있으면 'reason' 필드에 명시\n");
        sb.append("   - 예: \"일출 명소라 아침 첫 일정\", \"체력 소모 커서 오후\"\n");
        sb.append("3. **모든 관광지를 반드시 배치** (excluded는 특별한 경우만 사용)\n\n");

        // ✅ 중요 규칙 강화
        sb.append("### ⚠️ 중요 규칙 (반드시 준수!)\n");
        sb.append("1. **모든 관광지를 빠짐없이 배치**해야 합니다.\n");
        sb.append("2. **excluded는 비워두세요.** (정말 불가피한 경우만 사용)\n");
        sb.append("3. 각 날짜에 ").append(minPerDay).append("~").append(maxPerDay).append("개 관광지 배정\n");
        sb.append("4. 섬은 하루 1개만 배정 (페리 시간 고려)\n");
        sb.append("5. 동부(경도 126.7↑) ↔ 서부(경도 126.3↓) 같은 날 배정 금지\n");
        sb.append("6. 관광지를 균등하게 분배 (한 날에 몰아넣지 말 것)\n");
        sb.append("7. 빈 날짜가 없어야 합니다 (모든 날짜에 관광지 배정)\n\n");

        // ✅ 응답 형식 (식사 제거)
        sb.append("### 응답 형식 (JSON만, 설명 없이)\n");
        sb.append("```json\n");
        sb.append("{\n");
        sb.append("  \"days\": [\n");
        sb.append("    {\n");
        sb.append("      \"day\": 1,\n");
        sb.append("      \"items\": [\n");
        sb.append("        {\n");
        sb.append("          \"type\": \"SPOT\",\n");
        sb.append("          \"spotId\": 1,\n");
        sb.append("          \"name\": \"성산일출봉\",\n");
        sb.append("          \"reason\": \"일출 명소라 아침 첫 일정\"\n");
        sb.append("        },\n");
        sb.append("        {\n");
        sb.append("          \"type\": \"SPOT\",\n");
        sb.append("          \"spotId\": 2,\n");
        sb.append("          \"name\": \"섭지코지\",\n");
        sb.append("          \"reason\": \"성산일출봉과 가까워 연계 방문\"\n");
        sb.append("        }\n");
        sb.append("      ],\n");
        sb.append("      \"reasoning\": \"동부 숙소 기준 가까운 관광지 배정\"\n");
        sb.append("    },\n");
        sb.append("    {\n");
        sb.append("      \"day\": 2,\n");
        sb.append("      \"items\": [\n");
        sb.append("        {\n");
        sb.append("          \"type\": \"SPOT\",\n");
        sb.append("          \"spotId\": 3,\n");
        sb.append("          \"name\": \"천지연폭포\"\n");
        sb.append("        }\n");
        sb.append("      ],\n");
        sb.append("      \"reasoning\": \"남부 지역 관광\"\n");
        sb.append("    }\n");
        sb.append("  ],\n");
        sb.append("  \"excluded\": [],\n");
        sb.append("  \"excludeReason\": \"모든 관광지 배치 완료\"\n");
        sb.append("}\n");
        sb.append("```\n\n");

        // ✅ 재확인
        sb.append("### ✅ 최종 확인\n");
        sb.append("- 모든 ").append(totalSpots).append("개 관광지가 배치되었는가?\n");
        sb.append("- excluded 배열이 비어있는가?\n");
        sb.append("- 각 날짜에 관광지가 균등하게 분배되었는가?\n");
        sb.append("- 모든 날짜에 최소 1개 이상 관광지가 있는가?\n");

        return sb.toString();
    }

    /**
     * 지역 판별
     */
    private String getRegion(double lat, double lon) {
        if (lat >= 33.45 && lon >= 126.7) return "동부";
        if (lat >= 33.45 && lon < 126.3) return "서부";
        if (lat >= 33.45) return "북부";
        if (lat < 33.3 && lon < 126.3) return "남서부";
        if (lat < 33.3) return "남부";
        return "중부";
    }
}