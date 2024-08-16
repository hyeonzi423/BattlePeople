package com.woowahanrabbits.battle_people.validation;

import org.springframework.stereotype.Component;

import com.woowahanrabbits.battle_people.exception.CustomException;
import com.woowahanrabbits.battle_people.exception.ErrorCode;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class VoteValidator {
	public void validateBattleState(int currentState, int legalState) {
		if (currentState != legalState) {
			throw new CustomException(ErrorCode.ENDED_BATTLE);
		}
	}
}
