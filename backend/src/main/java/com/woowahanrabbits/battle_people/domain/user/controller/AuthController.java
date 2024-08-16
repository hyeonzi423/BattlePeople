package com.woowahanrabbits.battle_people.domain.user.controller;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.domain.UserToken;
import com.woowahanrabbits.battle_people.domain.user.dto.LoginRequest;
import com.woowahanrabbits.battle_people.domain.user.dto.LoginResponse;
import com.woowahanrabbits.battle_people.domain.user.infrastructure.UserRepository;
import com.woowahanrabbits.battle_people.domain.user.jwt.JwtUtil;
import com.woowahanrabbits.battle_people.domain.user.service.UserService;
import com.woowahanrabbits.battle_people.util.HttpUtils;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserRepository userRepository;
	@Value("${jwt.accessToken.expiration}")
	private long accessTokenExpiration;

	private final UserService userService;
	private final JwtUtil jwtUtil;

	@PostMapping("/login")
	public ResponseEntity<ApiResponseDto<LoginResponse>> login(@RequestBody LoginRequest loginRequest,
		HttpServletResponse response) {
		User user = userService.login(loginRequest);

		long userId = user.getId();
		String email = user.getEmail();
		String role = user.getRole();
		String nickname = user.getNickname();
		String access = jwtUtil.generateAccessToken(userId, email, nickname, role);
		String refresh = jwtUtil.generateRefreshToken(userId, email, nickname, role);
		UserToken userToken = new UserToken(user, access, refresh);

		response.addCookie(HttpUtils.createCookie("access", access, "/"));
		response.addCookie(
			HttpUtils.createCookie("refresh", refresh, "/battle-people/auth/refresh"));
		LoginResponse loginResponse = new LoginResponse(user,
			new Date(System.currentTimeMillis() + accessTokenExpiration));
		return ResponseEntity.ok(new ApiResponseDto<>("success", "login success", loginResponse));
	}

	@DeleteMapping("/logout")
	public ResponseEntity<?> logout(@CookieValue(value = "access", required = false) String access,
		HttpServletResponse response) {

		HttpUtils.deleteCookies(
			response,
			HttpUtils.accessTokenRemovalCookie,
			HttpUtils.refreshTokenRemovalCookie
		);

		return ResponseEntity.ok(new ApiResponseDto<>("success", "Logout", null));
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refresh(@CookieValue(name = "refresh") String refresh, HttpServletResponse response) {
		try {
			jwtUtil.isTokenExpired(refresh);
		} catch (ExpiredJwtException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiResponseDto<>("fail", "Refresh expired", null));
		}

		long userId = jwtUtil.extractUserId(refresh);
		// String username = jwtUtil.extractUsername(refresh);
		// String nickname = jwtUtil.extractNickname(refresh);
		// String userRole = jwtUtil.extractUserRole(refresh);

		Optional<User> user = userRepository.findUserById(userId);
		String email = user.get().getEmail();
		String nickname = user.get().getNickname();
		String role = user.get().getRole();
		String newAccess = jwtUtil.generateAccessToken(userId, email, nickname, role);

		response.addCookie(HttpUtils.createCookie("access", newAccess, "/"));
		return ResponseEntity.ok(new ApiResponseDto<>("success", "Refresh", null));
	}
}
