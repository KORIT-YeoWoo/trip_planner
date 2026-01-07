package com.korit.trip_planner_back.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 400 Bad Request
    INVALID_INPUT("INVALID_INPUT", "잘못된 입력값입니다"),
    MISSING_PARAMETER("MISSING_PARAMETER", "필수 파라미터가 누락되었습니다"),
    INVALID_FORMAT("INVALID_FORMAT", "잘못된 형식입니다"),

    // 401 Unauthorized
    UNAUTHORIZED("UNAUTHORIZED", "인증이 필요합니다"),
    INVALID_TOKEN("INVALID_TOKEN", "유효하지 않은 토큰입니다"),
    EXPIRED_TOKEN("EXPIRED_TOKEN", "만료된 토큰입니다"),

    // 403 Forbidden
    FORBIDDEN("FORBIDDEN", "접근 권한이 없습니다"),

    // 404 Not Found
    NOT_FOUND("NOT_FOUND", "요청한 리소스를 찾을 수 없습니다"),
    SPOT_NOT_FOUND("SPOT_NOT_FOUND", "관광지를 찾을 수 없습니다"),
    ITINERARY_NOT_FOUND("ITINERARY_NOT_FOUND", "일정을 찾을 수 없습니다"),
    USER_NOT_FOUND("USER_NOT_FOUND", "사용자를 찾을 수 없습니다"),

    // 409 Conflict
    DUPLICATE_RESOURCE("DUPLICATE_RESOURCE", "이미 존재하는 리소스입니다"),

    // 500 Internal Server Error
    INTERNAL_ERROR("INTERNAL_ERROR", "서버 내부 오류가 발생했습니다"),
    DATABASE_ERROR("DATABASE_ERROR", "데이터베이스 오류가 발생했습니다"),
    EXTERNAL_API_ERROR("EXTERNAL_API_ERROR", "외부 API 호출 중 오류가 발생했습니다");

    private final String code;
    private final String message;
}
