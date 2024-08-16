package com.woowahanrabbits.battle_people.domain.live.domain;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class LiveApplyUserId implements Serializable {

	private Long battleBoardId;
	private Long participantId;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}
		if (object == null || getClass() != object.getClass()) {
			return false;
		}
		LiveApplyUserId that = (LiveApplyUserId)object;
		return Objects.equals(battleBoardId, that.battleBoardId)
			&& Objects.equals(participantId, that.participantId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(battleBoardId, participantId);
	}
}
