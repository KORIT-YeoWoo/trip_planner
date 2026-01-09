package com.korit.trip_planner_back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // csrf 비활성화
        http.csrf(csrf -> csrf.disable());
        // http 기본 로그인 비활성화
        http.httpBasic(httpBasic -> httpBasic.disable());
        // form 로그인 비활성화
        http.formLogin(formLogin -> formLogin.disable());

        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/api/**").permitAll();
            auth.requestMatchers("/v3/api-docs/**").permitAll();
            auth.requestMatchers("/api-docs/**").permitAll();
            auth.requestMatchers("/swagger-ui/**").permitAll();
            auth.requestMatchers("/swagger-ui.html").permitAll();
            auth.requestMatchers("/doc").permitAll();
            auth.requestMatchers("/json").permitAll();
            auth.anyRequest().authenticated();
        });

        return http.build();
    }
}
