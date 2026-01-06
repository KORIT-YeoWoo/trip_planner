package com.korit.trip_planner_back.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private int page;           // 현재 페이지 (0부터 시작)
    private int size;           // 페이지 크기
    private int totalPages;     // 전체 페이지 수
    private long totalElements; // 전체 요소 수
    private boolean first;      // 첫 페이지 여부
    private boolean last;       // 마지막 페이지 여부

    // 생성자
    public PageResponse(List<T> content, int page, int size, long totalElements) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = (int) Math.ceil((double) totalElements / size);
        this.first = (page == 0);
        this.last = (page >= totalPages - 1);
    }
}