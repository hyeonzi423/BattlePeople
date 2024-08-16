package com.woowahanrabbits.battle_people.domain.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ApiResponseDto<T> {
	private String code;

	private String msg;

	private T data;

}
