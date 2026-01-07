package com.korit.trip_planner_back.exception;

import com.korit.trip_planner_back.dto.common.ApiResponse;
import com.korit.trip_planner_back.dto.common.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * NotFoundException 처리 (404)
     * - 관광지 없음
     * - 일정 없음
     * - 사용자 없음
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFoundException(NotFoundException e){
        log.warn("NotFoundException: {}", e.getMessage());

        ErrorResponse error = new ErrorResponse(
            e.getErrorCode().getCode(),
            e.getErrorCode().getMessage()
        );

        ApiResponse<Void> response = ApiResponse.error(
            e.getMessage(),
            error
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    /**
     * ValidationException 처리 (400)
     * - 입력값 검증 실패
     * - 필수 파라미터 누락
     * - 잘못된 형식
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(ValidationException e) {
        log.warn("ValidationException: {}", e.getMessage());

        ErrorResponse error = new ErrorResponse(
                e.getErrorCode().getCode(),
                e.getMessage()
        );

        ApiResponse<Void> response = ApiResponse.error(
                e.getMessage(),
                error
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * AuthException 처리 (401, 403)
     * - 인증 실패
     * - 권한 없음
     * - 토큰 만료
     */
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthException(AuthException e) {
        log.warn("AuthException: {}", e.getMessage());

        ErrorResponse error = new ErrorResponse(
                e.getErrorCode().getCode(),
                e.getMessage()
        );

        ApiResponse<Void> response = ApiResponse.error(
                e.getMessage(),
                error
        );

        // 401 or 403 구분
        HttpStatus status = e.getErrorCode().getCode().contains("UNAUTHORIZED")
                ? HttpStatus.UNAUTHORIZED
                : HttpStatus.FORBIDDEN;

        return ResponseEntity
                .status(status)
                .body(response);
    }

    /**
     * Spring Validation 예외 처리 (400)
     * @Valid 어노테이션으로 검증 실패 시
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValid(MethodArgumentNotValidException e) {
        log.warn("MethodArgumentNotValidException: {}", e.getMessage());

        // 모든 필드 에러를 하나의 메시지로 합침
        String errorMessage = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        ErrorResponse error = new ErrorResponse(
                "INVALID_INPUT",
                errorMessage
        );

        ApiResponse<Void> response = ApiResponse.error(
                errorMessage,
                error
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * 필수 파라미터 누락 (400)
     * @RequestParam required=true인 경우
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingServletRequestParameter(
            MissingServletRequestParameterException e) {
        log.warn("MissingServletRequestParameterException: {}", e.getMessage());

        String errorMessage = e.getParameterName() + " 파라미터가 필요합니다";

        ErrorResponse error = new ErrorResponse(
                "MISSING_PARAMETER",
                errorMessage
        );

        ApiResponse<Void> response = ApiResponse.error(
                errorMessage,
                error
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * 타입 불일치 (400)
     * 예: String을 Integer로 변환 실패
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException e) {
        log.warn("MethodArgumentTypeMismatchException: {}", e.getMessage());

        String errorMessage = e.getName() + "의 형식이 올바르지 않습니다";

        ErrorResponse error = new ErrorResponse(
                "INVALID_FORMAT",
                errorMessage
        );

        ApiResponse<Void> response = ApiResponse.error(
                errorMessage,
                error
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * BusinessException 처리 (500)
     * 위에서 처리되지 않은 비즈니스 예외
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        log.error("BusinessException: {}", e.getMessage(), e);

        ErrorResponse error = new ErrorResponse(
                e.getErrorCode().getCode(),
                e.getMessage()
        );

        ApiResponse<Void> response = ApiResponse.error(
                e.getMessage(),
                error
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    /**
     * 모든 예외 처리 (500)
     * 예상하지 못한 모든 예외의 최종 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unexpected Exception: {}", e.getMessage(), e);

        ErrorResponse error = new ErrorResponse(
                "INTERNAL_ERROR",
                "서버 내부 오류가 발생했습니다"
        );

        ApiResponse<Void> response = ApiResponse.error(
                "서버 내부 오류가 발생했습니다",
                error
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}
