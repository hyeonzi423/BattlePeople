package com.woowahanrabbits.battle_people.domain.user.dto;

import java.util.Date;

import com.woowahanrabbits.battle_people.domain.vote.domain.UserVoteOpinion;

import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class ParticipatedVotes {
	private final Long id;
	private final String title;
	private final Date registDate;
	private final String detail;
	private final Boolean isWin;

	public ParticipatedVotes(UserVoteOpinion userVoteOpinion, Boolean isWin) {
		this.id = userVoteOpinion.getVoteInfoId();
		this.title = userVoteOpinion.getVoteInfo().getTitle();
		this.registDate = userVoteOpinion.getVoteInfo().getStartDate();
		this.detail = userVoteOpinion.getVoteInfo().getDetail();
		this.isWin = isWin;
	}
}
