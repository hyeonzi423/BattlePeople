package com.woowahanrabbits.battle_people.domain.live.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ItemRequestDto {
	private Long userId;
	private Long targetIndex;
	private Integer itemCode;
}
