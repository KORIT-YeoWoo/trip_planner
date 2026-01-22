package com.korit.trip_planner_back.service;

import com.korit.trip_planner_back.entity.User;
import com.korit.trip_planner_back.mapper.UserMapper;
import com.korit.trip_planner_back.security.PrincipalUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        User user = extractUser(registrationId, oAuth2User);
        User existingUser = userMapper.findByOauth2Id(user.getOauth2Id());

        if (existingUser != null) {
            user = existingUser;
        }

        String role = (user.getRole() != null) ? user.getRole() : "ROLE_USER";

        return new PrincipalUser(
                Collections.singleton(new SimpleGrantedAuthority(role)),
                oAuth2User.getAttributes(),
                userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName(),
                user
        );
    }

    private User extractUser(String registrationId, OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        return switch (registrationId.toLowerCase()) {
            case "google" -> extractGoogleUser(attributes);
            case "naver" -> extractNaverUser(attributes);
            case "kakao" -> extractKakaoUser(attributes);
            default -> throw new OAuth2AuthenticationException("Unsupported provider");
        };
    }

    private User extractGoogleUser(Map<String, Object> attributes) {
        return User.builder()
                .oauth2Id(String.valueOf(attributes.get("sub")))
                .email((String) attributes.get("email"))
                .name((String) attributes.get("name"))
                .provider("google")
                .role("ROLE_USER")
                .build();
    }

    private User extractNaverUser(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return User.builder()
                .oauth2Id(String.valueOf(response.get("id")))
                .email((String) response.get("email"))
                .name((String) response.get("name"))
                .provider("naver")
                .role("ROLE_USER")
                .build();
    }

    private User extractKakaoUser(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        return User.builder()
                .oauth2Id(String.valueOf(attributes.get("id")))
                .email((String) kakaoAccount.get("email"))
                .name((String) profile.get("nickname"))
                .provider("kakao")
                .role("ROLE_USER")
                .build();
    }
}