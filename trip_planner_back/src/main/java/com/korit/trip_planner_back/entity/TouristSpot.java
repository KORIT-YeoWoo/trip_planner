package com.korit.trip_planner_back.entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TouristSpot {
    private int spotId;
    private String title;
    private String category;
    private String address;
    private double latitude;    // 위도
    private double longitude;   // 경도
    private int spotDuration;       // 지역 체류시간
    private Integer originalDuration;
    private int price;
    private String description;
    private String openingHrs;  // 영업 시작시간
    private String contact;     // 연락처
    private String spotImg;
    private boolean isIsland;   // 섬인가? ㅎㅎ 아닐걸?
    private LocalDateTime createdAt;
}
