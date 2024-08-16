package com.woowahanrabbits.battle_people.domain.user.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.woowahanrabbits.battle_people.domain.user.handler.JwtAuthenticationException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtil {
	@Value("${jwt.secret}")
	private String secretKey;

	@Value("${jwt.accessToken.expiration}")
	private long accessTokenExpiration;

	@Value("${jwt.refreshToken.expiration}")
	private long refreshTokenExpiration;

	public String generateAccessToken(long userId, String email, String nickname, String role) {

		return Jwts.builder()
			.subject(email)
			.issuedAt(new Date())
			.expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
			.signWith(SignatureAlgorithm.HS512, secretKey.getBytes())
			.claim("userId", userId)
			.claim("nickname", nickname)
			.claim("role", role)
			.compact();
	}

	public String generateRefreshToken(long userId, String email, String nickname, String role) {
		return Jwts.builder()
			.subject(email)
			.issuedAt(new Date())
			.expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
			.claim("userId", userId)
			.claim("nickname", nickname)
			.claim("role", role)
			.signWith(SignatureAlgorithm.HS512, secretKey.getBytes())
			.compact();
	}

	public Claims extractClaims(String token) {
		return Jwts.parser().setSigningKey(secretKey.getBytes()).build().parseSignedClaims(token).getBody();
	}

	public String extractUsername(String token) {
		return extractClaims(token).getSubject();
	}

	public Long extractUserId(String token) {
		return extractClaims(token).get("userId", Long.class);
	}

	public String extractUserRole(String token) {
		return extractClaims(token).get("role", String.class);
	}

	public String extractNickname(String token) {
		return extractClaims(token).get("nickname", String.class);
	}

	public boolean isTokenExpired(String token) {
		return extractClaims(token).getExpiration().before(new Date());
	}

	public boolean validateToken(String token, String type) {
		// Jwts.parser().verifyWith()

		if (isTokenExpired(token)) {
			throw new JwtAuthenticationException("JWT token is expired");
		}
		return true;
	}
}
