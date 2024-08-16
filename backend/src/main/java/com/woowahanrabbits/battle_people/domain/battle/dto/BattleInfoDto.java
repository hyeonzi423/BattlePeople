package com.woowahanrabbits.battle_people.domain.battle.dto;

import java.util.List;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class BattleInfoDto {
	private BattleBoard battleBoard;
	private VoteInfo voteInfo;
	private List<VoteOpinion> voteOpinion;

	public BattleInfoDto(BattleBoard battleBoard, VoteInfo voteInfo, List<VoteOpinion> voteOpinion) {
		this.battleBoard = battleBoard;
		this.voteInfo = voteInfo;
		this.voteOpinion = voteOpinion;
	}

}
