package com.woowahanrabbits.battle_people.domain.balancegame.service;

import java.util.List;

import com.woowahanrabbits.battle_people.domain.balancegame.dto.BalanceGameResponse;
import com.woowahanrabbits.battle_people.domain.balancegame.dto.CreateBalanceGameRequest;
import com.woowahanrabbits.battle_people.domain.user.domain.User;

public interface BalanceGameService {
	void addBalanceGame(CreateBalanceGameRequest createBalanceGameRequest, User user);

	List<BalanceGameResponse> getBalanceGameByConditions(Integer category, int status, int page, User user, int size);

	BalanceGameResponse getBalanceGameById(Long id, User user);

	// void checkBalanceGameEndDate();
}
