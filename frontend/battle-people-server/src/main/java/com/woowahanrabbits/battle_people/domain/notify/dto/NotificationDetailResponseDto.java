package com.woowahanrabbits.battle_people.domain.notify.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class NotificationDetailResponseDto {
	private Long id;
	private String title;
	private int notifyCode;
	private Object specificData;
}
