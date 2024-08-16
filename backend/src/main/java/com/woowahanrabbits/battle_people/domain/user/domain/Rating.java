package com.woowahanrabbits.battle_people.domain.user.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Rating {
	BALANCE_GAME_PARTICIPATE("밸런스게임", "투표", 3),
	BALANCE_GAME_WIN("밸런스게임", "승리", 5),
	LIVE_PARTICIPATE("라이브", "사전신청", 10),
	LIVE_WIN("라이브 투표", "승리", 10),
	LIVE_LOSS("라이브 투표", "패배", 5),
	LIVE_TIE("라이브 투표", "무승부", 7),
	LIVE_OWNER("라이브", "개최", 10);

	private final String session;
	private final String result;
	private final int point;

}
