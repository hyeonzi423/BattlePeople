package com.woowahanrabbits.battle_people.domain.user.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;
import com.woowahanrabbits.battle_people.domain.user.handler.JwtAuthenticationException;
import com.woowahanrabbits.battle_people.domain.user.service.PrincipalDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;
	private final PrincipalDetailsService principalDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		if (request.getCookies() == null) {
			filterChain.doFilter(request, response);
			return;
		}

		String access = null;
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("access")) {
				access = cookie.getValue();
				break;
			}
		}

		try {
			if (access != null) {
				if (jwtUtil.validateToken(access, "access")) {
					setAuthentication(access);
				} else {
					throw new JwtAuthenticationException("Invalid access token");
				}
			}
		} catch (JwtAuthenticationException e) {
			handleException(response, "JWT authentication error: " + e.getMessage(),
				HttpServletResponse.SC_UNAUTHORIZED);
			return;
		} catch (Exception e) {
			handleException(response, "Unexpected error: " + e.getMessage(),
				HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
		}

		filterChain.doFilter(request, response);
	}

	private void setAuthentication(String token) {
		Authentication authentication = createAuthentication(token);
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}

	private Authentication createAuthentication(String token) {
		UserDetails userDetails = principalDetailsService.loadUserByUsername(token);
		return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
	}

	private void handleException(HttpServletResponse response, String message, int status) throws IOException {
		ApiResponseDto<String> apiResponse = new ApiResponseDto<String>("fail", message, "");
		response.setStatus(status);
		response.setContentType("application/json");
		ObjectMapper objectMapper = new ObjectMapper();
		String jsonResponse = objectMapper.writeValueAsString(apiResponse);
		response.getWriter().write(jsonResponse);
	}
}
