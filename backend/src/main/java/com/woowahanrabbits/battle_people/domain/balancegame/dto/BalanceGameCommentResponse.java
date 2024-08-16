package com.woowahanrabbits.battle_people.domain.balancegame.dto;

import java.util.Date;

import com.woowahanrabbits.battle_people.domain.balancegame.domain.BalanceGameBoardComment;
import com.woowahanrabbits.battle_people.domain.user.dto.BasicUserDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class BalanceGameCommentResponse {
	private final Long id;
	private final Long battleId;

	private final BasicUserDto user;
	private final String content;
	private final Date registDate;

	public BalanceGameCommentResponse(BalanceGameBoardComment comment) {
		this.id = comment.getId();
		this.battleId = comment.getId();
		this.user = new BasicUserDto(comment.getUser());
		this.content = comment.getContent();
		this.registDate = comment.getRegistDate();
	}
}
