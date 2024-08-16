package com.woowahanrabbits.battle_people.domain.live.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;
import com.woowahanrabbits.battle_people.domain.live.dto.OpenViduTokenResponseDto;
import com.woowahanrabbits.battle_people.domain.live.dto.response.WriteTalkResponseDto;
import com.woowahanrabbits.battle_people.domain.live.service.LiveChatService;
import com.woowahanrabbits.battle_people.domain.live.service.OpenViduService;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.resolver.LoginUser;

import io.openvidu.java.client.OpenViduException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/openvidu")
public class OpenViduController {
	private final OpenViduService openViduService;
	private final LiveChatService liveChatService;

	@PostMapping("/get-token")
	public ResponseEntity<ApiResponseDto<OpenViduTokenResponseDto>> getToken(@RequestParam Long battleId,
		@LoginUser User user) throws OpenViduException {
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "",
				openViduService.getToken(battleId, user)));
	}

	@PostMapping("/user-left")
	public ResponseEntity<ApiResponseDto<?>> userLeft(@RequestParam Long battleId, @LoginUser User user) {
		openViduService.userLeft(battleId, user.getId());
		return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDto<>("success", "", null));
	}

	@ExceptionHandler
	public ResponseEntity<ApiResponseDto<?>> handleException(Exception exception) {
		exception.printStackTrace();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponseDto<>("fail", "", null));
	}

	@GetMapping("/user-speak-request/{battleId}")
	public ResponseEntity<ApiResponseDto<List<WriteTalkResponseDto>>> getSpeakRequestList(@PathVariable Long battleId,
		@LoginUser User user) {
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "", liveChatService.getRequestList(battleId, user.getId())));
	}

	@GetMapping("/is-user-speak-request/{battleId}")
	public ResponseEntity<ApiResponseDto<Integer>> isUserSpeakRequest(@PathVariable Long battleId,
		@LoginUser User user) {
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "", liveChatService.isUserSendRequest(battleId, user.getId())));
	}

}
