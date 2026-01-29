package com.korit.trip_planner_back.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TravelType {
    INFLUENCER("인플루언서형",
            "여행의 목적지보다 도로 위의 순간들을 사랑하는 당신, 매 순간을 온전히 느끼며 자유로운 영혼으로 여행합니다."),

    FOODIE("미식형",
            "여행의 진정한 재미는 먹진 풍경보다 맛진 재료에 있다는 것 아니겠어?"),

    EXPLORER("탐험가형",
            "이동과 탐험에 집중하며, 효율적으로 많은 곳을 경험하는 여행자"),

    DRIVER("드라이버형",
            "여행의 진정한 재미는 멋진 풍경을 보며 달리는 것 아니겠어?"),

    FLEX("플렉스형",
            "한 곳에 머물며 알차게 관광하고 미식을 즐기는 여유로운 여행"),

    VACATION("바캉스형",
            "휴식과 맛집 탐방을 중심으로 여유롭게 즐기는 여행"),

    COST_EFFECTIVE("갓성비형",
            "이동은 최소화하되 관광지는 빡빡하게 돌아다니는 효율적인 여행"),

    HEALING("힐링형",
            "이동과 관광을 최소화하며 완전한 휴식을 취하는 여행"),

    BALANCE("밸런스형",
            "모든 요소가 적당히 조화를 이루는 균형잡힌 여행");

    private final String displayName;
    private final String description;
}