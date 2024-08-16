package com.woowahanrabbits.battle_people.validation;

import java.util.Calendar;
import java.util.Date;

import org.springframework.stereotype.Component;

import com.woowahanrabbits.battle_people.domain.battle.dto.BattleInviteRequest;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleRepository;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.exception.CustomException;
import com.woowahanrabbits.battle_people.exception.ErrorCode;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class BattleValidator {

	static Date now = new Date();
	static Calendar calendar = Calendar.getInstance();
	private final BattleRepository battleRepository;

	public void validateOppositeUser(BattleInviteRequest battleInviteRequest, User user) {
		if (battleInviteRequest.getOppositeUserId() == user.getId()) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
	}

	public void validateTime(int minutes) {
		if (minutes < 10) {
			throw new CustomException(ErrorCode.INVALID_BATTLE_TIME);
		}
	}

	public void validateStartTime(Date startDate, int minute) {
		calendar.setTime(now);
		calendar.add(Calendar.MINUTE, minute);
		Date minutesLater = calendar.getTime();

		if (startDate.before(minutesLater)) {
			throw new CustomException(ErrorCode.INVALID_BATTLE_STARTTIME);
		}
	}

	public void checkOtherBattles(User user, Date startDate, Date endDate) {
		if (battleRepository.checkMyBattles(user.getId(), startDate, endDate)) {
			throw new CustomException(ErrorCode.DUPLICATED_BATTLE);
		}
	}

	public void validateBattleDate(Date startDate, int minute) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(now);
		calendar.add(Calendar.MINUTE, minute);
		if (startDate.before(now)) {
			throw new CustomException(ErrorCode.ENDED_BATTLE);
		}
	}
}
