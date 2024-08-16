package com.woowahanrabbits.battle_people.domain.user.dto;

import java.util.Date;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;

import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class CreateLives {
	private final Long battleBoardId;
	private final String title;
	private final Date registDate;
	private final Integer isWin; // register가 이기면 0, opposite이 이기면 1, 무승부면 2, 예정은 4

	public CreateLives(BattleBoard battleBoard, Integer isWin) {
		this.battleBoardId = battleBoard.getId();
		this.title = battleBoard.getVoteInfo().getTitle();
		this.registDate = battleBoard.getRegistDate();
		this.isWin = isWin;
	}
}
