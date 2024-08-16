package com.woowahanrabbits.battle_people.domain.vote.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GetVoteInfoWithUserCountDto {
	private Long id;
	private String title;
	private Date startDate;
	private Date endDate;
	private int category;
	private int currentState;
	private String detail;
	private int userCount;
	private int maxPeopleCount;
	private boolean isUserApplied;
}
