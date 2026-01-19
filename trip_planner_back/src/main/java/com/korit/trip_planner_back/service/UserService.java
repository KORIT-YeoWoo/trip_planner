package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.entity.User;
import com.korit.trip_planner_back.mapper.UserMapper;
import com.korit.trip_planner_back.security.PrincipalUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    public User findUserByOauth2Id(String oauth2Id) {
        return userMapper.findByOauth2Id(oauth2Id);
    }

    public User createUser(Authentication authentication){
        PrincipalUser principalUser = (PrincipalUser) authentication.getPrincipal();
        User user = principalUser.getUser();
        user.setNickname(null);
        userMapper.insert(user);
        return user;
    }

    public void updateNickname(int userId, String newNickname) {
        User user = User.builder()
                .userId(userId)
                .nickname(newNickname)
                .build();

        userMapper.updateNickname(user);
    }
}
