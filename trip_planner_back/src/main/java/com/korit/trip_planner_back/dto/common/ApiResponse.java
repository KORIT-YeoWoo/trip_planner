package com.korit.trip_planner_back.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private ErrorResponse error;

    // 편의 메소드

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "성공", null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    public static <T> ApiResponse<T> error(String message, ErrorResponse error) {
        return new ApiResponse<>(false, null, message, error);
    }
}