package com.korit.trip_planner_back.exception;

public class ValidationException extends BusinessException {

    public ValidationException(ErrorCode errorCode) {
        super(errorCode);
    }

    public ValidationException(ErrorCode errorCode, String customMessage){
        super(errorCode, customMessage);
    }

    // 편의 생성자
    public static ValidationException inValidInput(String fieldName){
        return new ValidationException(
                ErrorCode.INVALID_INPUT,
                fieldName + "(이)가 유효하지 않습니다"
        );
    }

    public static ValidationException missingParameter(String paramName){
        return new ValidationException(
                ErrorCode.MISSING_PARAMETER,
                paramName + "파라미터가 필요합니다"
        );
    }


    public static ValidationException invalidFormat(String fieldName, String expectedFormat){
        return new ValidationException(
                ErrorCode.INVALID_FORMAT,
                fieldName + "의 형식이 올바르지 않습니다. 예상 형식: "+ expectedFormat
        );
    }
}
