package com.woowahanrabbits.battle_people.domain.user.handler;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ForbiddenExceptionHandler implements AccessDeniedHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
		AccessDeniedException accessDeniedException) throws IOException {
		ApiResponseDto<String> apiResponse = new ApiResponseDto<>("fail", "Forbidden: Access is denied", null);
		response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		response.setContentType("application/json");
		ObjectMapper objectMapper = new ObjectMapper();
		String jsonResponse = objectMapper.writeValueAsString(apiResponse);
		response.getWriter().write(jsonResponse);
	}
}
