package com.korit.trip_planner_back.security;

import com.korit.trip_planner_back.entity.User;
import com.korit.trip_planner_back.jwt.JwtTokenProvider;
import com.korit.trip_planner_back.mapper.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        Object principal = authentication.getPrincipal();
        User user = null;

        // 구글(Oidc)과 기타(Kakao, Naver) 분기 처리
        if (principal instanceof PrincipalUser) {
            user = ((PrincipalUser) principal).getUser();
        } else if (principal instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) principal;
            user = User.builder()
                    .oauth2Id(oidcUser.getSubject())
                    .email(oidcUser.getEmail())
                    .name(oidcUser.getFullName())
                    .provider("google")
                    .role("ROLE_USER")
                    .build();
        }

        // DB 저장 및 조회
        User existingUser = userMapper.findByOauth2Id(user.getOauth2Id());
        if (existingUser == null) {
            userMapper.insert(user);
            existingUser = userMapper.findByOauth2Id(user.getOauth2Id());
        }

        // 토큰 생성 및 리다이렉트 (프론트엔드 콜백 주소로)
        String accessToken = jwtTokenProvider.createAccessToken(existingUser);
        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendUrl + "/auth/oauth2/callback") // 프론트의 라우터 경로와 맞춰야 함
                .queryParam("accessToken", accessToken)
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}