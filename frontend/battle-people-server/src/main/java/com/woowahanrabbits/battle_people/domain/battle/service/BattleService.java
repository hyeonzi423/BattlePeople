package com.woowahanrabbits.battle_people.domain.battle.service;

import java.util.List;

import com.woowahanrabbits.battle_people.domain.battle.dto.AwaitingBattleResponseDto;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleApplyDto;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleInviteRequest;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleRespondRequest;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleResponse;
import com.woowahanrabbits.battle_people.domain.notify.dto.NotificationDetailResponseDto;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.dto.CreateLives;

public interface BattleService {
	void registBattle(BattleInviteRequest battleInviteRequest, User user);

	BattleResponse getReceivedBattle(Long id);

	void acceptOrDeclineBattle(BattleRespondRequest battleRespondRequest, User user);

	List<AwaitingBattleResponseDto> getAwaitingBattleList(Integer category, int page, User user, int size);

	int applyBattle(BattleApplyDto battleApplyDto, User user);

	List<CreateLives> getBattleBoardsByUserId(Long userId);

	NotificationDetailResponseDto getNotificationDetail(Long notifyId);
}
