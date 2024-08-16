package com.woowahanrabbits.battle_people.domain.battle.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.dto.BattleOpinionDto;

import lombok.Getter;

@Getter
public class AwaitingBattleResponseDto {

	private Long id;
	private String title;
	private List<BattleOpinionDto> opinions;
	private Date startDate;
	private Date endDate;
	private int category;
	private int maxPeopleCount;
	private int currentPeopleCount;
	private boolean isVoted;

	public AwaitingBattleResponseDto(BattleBoard battleBoard, VoteInfo voteInfo,
		List<BattleOpinionDto> battleOpinionDtos, int currentPeopleCount, int maxPeopleCount, boolean isVoted) {
		this.id = battleBoard.getId();
		this.title = voteInfo.getTitle();
		this.opinions = battleOpinionDtos;
		this.currentPeopleCount = currentPeopleCount;
		this.maxPeopleCount = maxPeopleCount;
		this.isVoted = isVoted;
		this.startDate = voteInfo.getStartDate();
		this.endDate = voteInfo.getEndDate();
		this.category = voteInfo.getCategory();
	}

	@JsonGetter("isVoted")
	public boolean isVoted() {
		return isVoted;
	}

	@JsonIgnore
	public boolean getVoted() {
		return isVoted;
	}

	public AwaitingBattleResponseDto(BattleBoard battleBoard, VoteInfo voteInfo,
		List<BattleOpinionDto> battleOpinionDtos, int userCount, int maxPeopleCount) {
		this.id = battleBoard.getId();
		this.title = voteInfo.getTitle();
		this.opinions = battleOpinionDtos;
		this.maxPeopleCount = maxPeopleCount;
		this.startDate = voteInfo.getStartDate();
		this.endDate = voteInfo.getEndDate();
		this.currentPeopleCount = userCount;
		this.category = voteInfo.getCategory();

	}
}
