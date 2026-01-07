package com.korit.trip_planner_back.exception;


public class NotFoundException extends BusinessException {

    public NotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
    public NotFoundException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    // 편의 생성자
    public static NotFoundException spot(Long spotId) {
        return new NotFoundException(
                ErrorCode.SPOT_NOT_FOUND,
                "ID " + spotId + "번 관광지를 찾을 수 없습니다"
        );
    }

    public static NotFoundException itinerary(Long itineraryId) {
        return new NotFoundException(
                ErrorCode.ITINERARY_NOT_FOUND,
                "ID " + itineraryId + "번 일정을 찾을 수 없습니다"
        );
    }

    public static NotFoundException user(Long userId) {
        return new NotFoundException(
                ErrorCode.USER_NOT_FOUND,
                "ID " + userId + "번 사용자를 찾을 수 없습니다"
        );
    }
}