package com.korit.trip_planner_back.filter;

import com.korit.trip_planner_back.entity.User;
import com.korit.trip_planner_back.jwt.JwtTokenProvider;
import com.korit.trip_planner_back.mapper.UserMapper;
import com.korit.trip_planner_back.security.PrincipalUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Period;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = bearerToken.replaceAll("Bearer ", "");
        if (!jwtTokenProvider.validateToken(accessToken)) {
            filterChain.doFilter(request, response);
            return;
        }

        int userId = jwtTokenProvider.getUserId(accessToken);
        User foundUser = userMapper.findByUserId(userId);
        if (foundUser == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 권한 설정 (DB에 role 컬럼 필수)
        Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(foundUser.getRole()));

        // null 안전을 고려한 attributes 구성
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("id", foundUser.getOauth2Id());

        PrincipalUser principalUser = new PrincipalUser(authorities, attributes, "id", foundUser);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principalUser, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }


}
