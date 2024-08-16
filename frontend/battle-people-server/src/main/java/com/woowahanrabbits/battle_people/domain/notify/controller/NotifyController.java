package com.woowahanrabbits.battle_people.domain.notify.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;
import com.woowahanrabbits.battle_people.domain.battle.service.BattleService;
import com.woowahanrabbits.battle_people.domain.notify.service.NotifyService;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.resolver.LoginUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notify")
@Tag(name = "NotifyController", description = "알림 컨트롤러")
public class NotifyController {

	private final NotifyService notifyService;
	private final BattleService battleService;

	@GetMapping("/unread")
	@Operation(summary = "안읽은 알림 여부 조회")
	public ResponseEntity<?> hasUnreadNotifications(@LoginUser User user) {
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "", notifyService.hasUnreadNotifications(user.getId())));
	}

	@GetMapping("")
	@Operation(summary = "사용자 알림 전체 조회")
	public ResponseEntity<?> getNotifications(@LoginUser User user) {
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "", notifyService.getNotifications(user.getId())));
	}

	@GetMapping("/detail/{notifyId}")
	@Operation(summary = "특정 알림 정보 불러오기")
	public ResponseEntity<?> getNotifications(@PathVariable Long notifyId, @LoginUser User user) {
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "", battleService.getNotificationDetail(notifyId)));
	}

	@DeleteMapping("/{notifyId}")
	@Operation(summary = "특정 알림 삭제")
	public ResponseEntity<?> deleteNotification(@PathVariable Long notifyId, @LoginUser User user) {

		notifyService.deleteNotification(notifyId);

		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "", null));
	}

}
