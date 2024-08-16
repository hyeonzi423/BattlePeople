package com.woowahanrabbits.battle_people.domain.balancegame.dto;

import java.util.Date;
import java.util.List;

import org.hibernate.validator.constraints.Range;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class CreateBalanceGameRequest {
	@NotBlank
	private String title;
	@NotNull
	private String detail;
	@NotNull
	private Date startDate;

	private Date endDate;
	@Range(min = 0, max = 7)
	private Integer category;

	@Size(min = 2, max = 2)
	private List<String> opinions;
}
