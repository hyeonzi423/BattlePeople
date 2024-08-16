package com.woowahanrabbits.battle_people.domain.notify.controller;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicDto;
import com.woowahanrabbits.battle_people.domain.live.dto.request.SocketRequestDto;
import com.woowahanrabbits.battle_people.domain.notify.domain.Notify;
import com.woowahanrabbits.battle_people.domain.notify.dto.NotificationResponseDto;
import com.woowahanrabbits.battle_people.domain.notify.infrastructure.NotifyRepository;
import com.woowahanrabbits.battle_people.domain.notify.service.NotifyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotifyMessageController {

	private final NotifyService notifyService;
	private final NotifyRepository notifyRepository;
	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;

	@MessageMapping("/notify/{userId}")
	public void sendUpdateNofityList(@DestinationVariable Long userId,
		SocketRequestDto<NotificationResponseDto> socketRequestDto) {
		if (socketRequestDto.getType().equals("read")) {
			NotificationResponseDto notifyDto = (NotificationResponseDto)socketRequestDto.getData();
			Notify notify = notifyRepository.findById(notifyDto.getId()).orElse(null);
			if (notify == null) {
				return;
			}
			if (notify.isRead()) {
				return;
			}
			redisTemplate.convertAndSend("notify-list", RedisTopicDto.builder()
				.type("read")
				.channelId(userId)
				.responseDto(notifyService.updateReadState(notify.getId()))
				.build());

		}
	}
}
