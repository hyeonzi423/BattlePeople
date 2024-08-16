package com.woowahanrabbits.battle_people.domain.vote.dto;

import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;

import lombok.Getter;

@Getter
public class BattleOpinionDto {
	private final Integer index;
	private final String opinion;

	public BattleOpinionDto(VoteOpinion opinion) {
		this.index = opinion.getVoteOpinionIndex();
		this.opinion = opinion.getOpinion();
	}
}
