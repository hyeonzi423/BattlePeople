package com.woowahanrabbits.battle_people.domain.vote.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CurrentVoteResponseDto {
	private Integer totalCount;
	private List<VoteOpinionDtoWithVoteCount> opinions;
}
