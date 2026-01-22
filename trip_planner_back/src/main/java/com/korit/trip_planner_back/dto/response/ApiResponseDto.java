package com.korit.trip_planner_back.dto.response; // 패키지 경로는 프로젝트에 맞게 수정하세요

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponseDto<T> {
    private boolean success;
    private String message;
    private T data;

    // 성공 응답을 만드는 정적 팩토리 메서드
    public static <T> ApiResponseDto<T> success(T data) {
        return new ApiResponseDto<>(true, "요청에 성공하였습니다.", data);
    }

    // 실패 응답을 만드는 정적 팩토리 메서드
    public static <T> ApiResponseDto<Object> error(String message) {
        return new ApiResponseDto<>(false, message, null);
    }
}