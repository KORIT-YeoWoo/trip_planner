package com.korit.trip_planner_back.mapper;

import com.korit.trip_planner_back.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    // 회원가입
    void insert(User user);

    // 회원조회
    User findByUserId(Long userId);
    User findByOauth2Id(Long oauth2Id);
    User findByNickname(String nickname);

    // 닉네임 값 넣기
    void updateNickname(User user);
}
