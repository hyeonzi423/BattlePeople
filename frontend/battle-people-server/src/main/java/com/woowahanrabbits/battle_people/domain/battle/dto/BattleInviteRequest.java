package com.woowahanrabbits.battle_people.domain.battle.dto;

import java.util.Date;

import org.hibernate.validator.constraints.Range;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class BattleInviteRequest {
	@NotBlank
	private String title;
	@NotNull
	private String detail;
	@NotNull
	private Date startDate;
	@NotNull
	private int time;
	@Range(min = 0, max = 7)
	private Integer category;

	@NotNull
	@Min(1)
	private Long oppositeUserId;
	private String opinion;
	@Max(Long.MAX_VALUE)
	private Integer maxPeopleCount;
	@NotNull
	private String battleRule;
}
