package com.woowahanrabbits.battle_people.domain.live.dto.request;

import lombok.Data;

@Data
public class WriteChatRequestDto {
	private Long userId;
	private String message;
}

