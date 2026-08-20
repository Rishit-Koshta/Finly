package com.rishit.financetracker.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;

@Service
public class JwtService {

    private final String SECRET = "ASJHDJSFHIYEYUEWOAKJHGJDGDFHSLAZXCVNZBCXBCXVZCVJDYUYIWIUWIENB7548298543950984"; // 🔥 keep long

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ✅ Validate + extract userId (or email)
    public String validateToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject(); // usually email/userId
    }
}
