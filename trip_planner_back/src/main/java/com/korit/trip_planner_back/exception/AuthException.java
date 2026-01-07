package com.korit.trip_planner_back.exception;

public class AuthException extends BusinessException {

    public AuthException(ErrorCode errorCode) {
        super(errorCode);
    }

    public AuthException(ErrorCode errorCode, String customMessage){
        super(errorCode, customMessage);
    }

    // 편의 생성자
    public static AuthException unauthorized() {
        return new AuthException(
                ErrorCode.UNAUTHORIZED,
                "로그인이 필요한 서비스입니다"
        );
    }

    public static AuthException forbidden() {
        return new AuthException(
                ErrorCode.FORBIDDEN,
                "이 작업을 수행할 권한이 없습니다"
        );
    }

    public static AuthException invalidToken() {
        return new AuthException(
                ErrorCode.INVALID_TOKEN,
                "유효하지 않은 인증 토큰입니다"
        );
    }

    public static AuthException expiredToken() {
        return new AuthException(
                ErrorCode.EXPIRED_TOKEN,
                "인증 토큰이 만료되었습니다. 다시 로그인해주세요"
        );
    }
}
