package com.woowahanrabbits.battle_people.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ApiResponseDto> handleRuntimeException(RuntimeException error) {
		log.error("RuntimeException", error);
		ApiResponseDto res = new ApiResponseDto("fail", error.getMessage(), null);
		return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiResponseDto<String>> handleIllegalArgumentException(IllegalArgumentException error) {
		log.error("IllegalArgumentException", error);
		ApiResponseDto<String> response = new ApiResponseDto<>("fail", error.getMessage(), null);
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponseDto<String>> handleException(Exception error) {
		log.error("Exception", error);
		ApiResponseDto<String> response = new ApiResponseDto<>("fail", "An unexpected error occurred",
			error.getMessage());
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiResponseDto<String>> handleAccessDeniedException(AccessDeniedException ex) {
		log.error("AccessDeniedException", ex);
		ApiResponseDto<String> response = new ApiResponseDto<>("fail", "An error occurred: Access Denied", null);
		return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(CustomException.class)
	public ResponseEntity<ApiResponseDto<String>> handleCustomException(CustomException error) {
		log.error("CustomException", error);
		ApiResponseDto<String> response = new ApiResponseDto<>("fail", error.getErrorCode().getMessage(), null);
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
}
