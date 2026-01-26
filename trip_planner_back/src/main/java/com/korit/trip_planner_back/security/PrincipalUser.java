package com.korit.trip_planner_back.security;

import com.korit.trip_planner_back.entity.User;
import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
public class PrincipalUser extends DefaultOAuth2User {

    private final User user;

    public PrincipalUser(Collection<? extends GrantedAuthority> authorities,
                         Map<String, Object> attributes,
                         String nameAttributeKey,
                         User user) {
        super(authorities, attributes, nameAttributeKey);
        this.user = user;
    }

    // ✅ 수정: 안전한 캐스팅
    public static PrincipalUser getAuthenticatedPrincipalUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 1. 인증 객체가 null인 경우
        if (authentication == null) {
            return null;
        }

        // 2. Principal 가져오기
        Object principal = authentication.getPrincipal();

        // 3. 타입 체크 후 안전하게 캐스팅
        if (principal instanceof PrincipalUser) {
            return (PrincipalUser) principal;
        }

        // 4. Anonymous 사용자 또는 다른 타입인 경우
        return null;
    }
}