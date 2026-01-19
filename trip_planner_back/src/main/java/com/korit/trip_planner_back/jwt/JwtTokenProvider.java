package com.korit.trip_planner_back.jwt;

import com.korit.trip_planner_back.entity.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String createAccessToken(User userEntity) {
        Date now = new Date();
        long expiredTime = now.getTime() + (1000L * 60L * 60L * 24L);
        Date expiredDate = new Date(expiredTime);

        return Jwts.builder()
                .subject("Server Access Token")
                .issuer("HyeokJung")
                .issuedAt(new Date())
                .expiration(expiredDate)
                .claim("userId", userEntity.getUserId())
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Long getUserId(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("userId", Long.class);
    }
}
