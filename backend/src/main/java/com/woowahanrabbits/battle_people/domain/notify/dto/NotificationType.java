package com.woowahanrabbits.battle_people.domain.notify.dto;

import com.woowahanrabbits.battle_people.domain.user.domain.Rating;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum NotificationType {
	BATTLE_REQUEST(0, "%s으로부터 도전장이 도착했습니다."),
	LIVE_NOTICE(1, "[%s] 라이브가 5분 후 시작됩니다!"),
	BATTLE_ACCEPT(2, "[%s]님이 배틀을 수락했습니다."),
	BATTLE_DECLINE(3, "[%s]님이 배틀을 거절했습니다."),
	ADD_POINT(4, "[%s] %s에 %s하여 %d점을 얻었습니다.");

	private final int code;
	private final String messageTemplate;

	public String formatMessage(VoteInfo voteInfo, Rating rating) {
		return String.format(this.messageTemplate, voteInfo.getTitle(), rating.getSession(), rating.getResult(),
			rating.getPoint());
	}

}
