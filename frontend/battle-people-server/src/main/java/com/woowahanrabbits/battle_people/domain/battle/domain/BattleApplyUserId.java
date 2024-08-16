package com.woowahanrabbits.battle_people.domain.battle.domain;

import java.io.Serializable;

import lombok.Data;

@Data
public class BattleApplyUserId implements Serializable {

	private Long battleBoard;
	private Long user;

	// 기본 생성자
	public BattleApplyUserId() {
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}

		BattleApplyUserId that = (BattleApplyUserId)obj;

		if (!user.equals(that.user)) {
			return false;
		}
		return battleBoard.equals(that.battleBoard);
	}

	@Override
	public int hashCode() {
		int result = user.hashCode();
		result = 31 * result + battleBoard.hashCode();
		return result;
	}
}
