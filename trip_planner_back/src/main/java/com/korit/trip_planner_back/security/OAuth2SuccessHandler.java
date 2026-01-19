package com.korit.trip_planner_back.security;

import com.korit.trip_planner_back.entity.User;
import com.korit.trip_planner_back.jwt.JwtTokenProvider;
import com.korit.trip_planner_back.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        User foundUser = userService.findUserByOauth2Id(authentication.getName());
        if (foundUser == null) {
            foundUser = userService.createUser(authentication);
        }
        String accessToken = jwtTokenProvider.createAccessToken(foundUser);
        response.sendRedirect("http://localhost:5173/auth/login/oauth2?accessToken=" + accessToken);
    }
}
