package com.woowahanrabbits.battle_people.domain.vote.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserWinHistory {
	private int debateCnt;
	private int winCnt;
	private int loseCnt;
	private int winRate;
}
