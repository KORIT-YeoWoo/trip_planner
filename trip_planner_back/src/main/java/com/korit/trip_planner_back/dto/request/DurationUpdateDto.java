package com.korit.trip_planner_back.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DurationUpdateDto {
    private int duration;  // 변경할 체류 시간 (분)

    // 유효성 검증
    public boolean isValid() {
        return duration >= 10 && duration <= 240;  // 10분 ~ 4시간
    }
}