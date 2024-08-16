package com.woowahanrabbits.battle_people.domain.balancegame.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class AddBalanceGameCommentRequest {
	@NotNull
	@Min(1)
	private Long battleId;
	@NotBlank
	private String content;
}
