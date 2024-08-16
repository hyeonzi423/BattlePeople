package com.woowahanrabbits.battle_people.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class JoinRequest {
	private final String email;
	private final String password;
	private String nickname;
}
