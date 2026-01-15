package com.korit.trip_planner_back.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFound(NotFoundException e){
        return ResponseEntity.status(404)
                .body(Map.of("message",e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(IllegalArgumentException e){
        return ResponseEntity.badRequest()
                .body(Map.of("message",e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException e){
        String message = e.getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(","));

        return ResponseEntity.badRequest()
                .body(Map.of("message",message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e){
        e.printStackTrace();
        return ResponseEntity.internalServerError()
                .body(Map.of("message","서버 오류가 발생했습니다."));
    }
}
