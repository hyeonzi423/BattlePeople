package com.woowahanrabbits.battle_people.domain.balancegame.dto;

import java.util.Date;
import java.util.List;

import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.dto.VoteOpinionDtoWithVoteCount;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class BalanceGameResponse {
	private Long id;        // voteInfoId
	private String title;         // 투표 주제
	private String detail;
	private Date startDate; //시작일
	private Date endDate; //종료일
	private Integer category; //카테고리

	private List<VoteOpinionDtoWithVoteCount> opinions; //주장들
	private int currentState; //현재상태
	private Integer userVote; //유저의 선택

	public BalanceGameResponse(VoteInfo voteInfo, List<VoteOpinionDtoWithVoteCount> opinions) {
		this.id = voteInfo.getId();
		this.title = voteInfo.getTitle();
		this.detail = voteInfo.getDetail();
		this.startDate = voteInfo.getStartDate();
		this.endDate = voteInfo.getEndDate();
		this.category = voteInfo.getCategory();
		this.opinions = opinions;
		this.currentState = voteInfo.getCurrentState();
	}

	public BalanceGameResponse(VoteInfo voteInfo) {
		this.id = voteInfo.getId();
		this.title = voteInfo.getTitle();
		this.detail = voteInfo.getDetail();
		this.startDate = voteInfo.getStartDate();
		this.endDate = voteInfo.getEndDate();
		this.category = voteInfo.getCategory();
		this.currentState = voteInfo.getCurrentState();
	}
}
