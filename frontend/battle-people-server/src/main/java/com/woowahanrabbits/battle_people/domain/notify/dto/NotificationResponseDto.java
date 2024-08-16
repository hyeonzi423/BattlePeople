package com.woowahanrabbits.battle_people.domain.notify.dto;

import com.woowahanrabbits.battle_people.domain.notify.domain.Notify;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDto {
	private Long id;
	private int notifyCode;
	private String title;
	private boolean isRead;

	public NotificationResponseDto(Notify notify) {
		this.id = notify.getId();
		this.notifyCode = notify.getNotifyCode();
		this.title = notify.getTitle();
		this.isRead = notify.isRead();
	}
}
