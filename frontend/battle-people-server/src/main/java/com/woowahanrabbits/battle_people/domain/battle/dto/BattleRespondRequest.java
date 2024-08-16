package com.woowahanrabbits.battle_people.domain.battle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class BattleRespondRequest {
	@NotNull
	@Min(1)
	private Long battleId;
	@Pattern(regexp = "^(accept|decline)$", message = "Value must be either 'accept' or 'decline'")
	private String respond;
	private String content;
}
