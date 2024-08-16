package com.woowahanrabbits.battle_people.domain.vote.domain;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class UserVoteOpinionId implements Serializable {
	private Long userId;
	private Long voteInfoId;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}
		if (object == null || getClass() != object.getClass()) {
			return false;
		}
		UserVoteOpinionId that = (UserVoteOpinionId)object;
		return Objects.equals(userId, that.userId)
			&& Objects.equals(voteInfoId, that.voteInfoId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(userId, voteInfoId);
	}

}
