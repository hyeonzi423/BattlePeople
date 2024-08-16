package com.woowahanrabbits.battle_people.domain.vote.domain;

import com.woowahanrabbits.battle_people.domain.user.domain.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(UserVoteOpinionId.class)
public class UserVoteOpinion {
	@Id
	@Column(name = "user_id", insertable = false, updatable = false)
	private Long userId;

	@Id
	@Column(name = "vote_info_id", insertable = false, updatable = false)
	private Long voteInfoId;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	@MapsId("userId")
	private User user;

	@ManyToOne
	@JoinColumn(name = "vote_info_id", nullable = false)
	@MapsId("voteInfoId")
	private VoteInfo voteInfo;

	private int voteInfoIndex;

	public Long getUserId() {
		return user != null ? user.getId() : null;
	}

	public Long getVoteInfoId() {
		return voteInfo != null ? voteInfo.getId() : null;
	}

}
