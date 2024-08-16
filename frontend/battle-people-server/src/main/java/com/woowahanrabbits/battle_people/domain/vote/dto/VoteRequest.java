package com.woowahanrabbits.battle_people.domain.vote.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteRequest {
	private Long userId;
	private int voteInfoIndex;
}
