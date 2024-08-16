package com.woowahanrabbits.battle_people.domain.live.service;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.live.dto.OpenViduTokenResponseDto;
import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicDto;
import com.woowahanrabbits.battle_people.domain.user.domain.User;

import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;

public interface OpenViduService {
	Session createSession(BattleBoard battleBoard) throws OpenViduJavaClientException, OpenViduHttpException;

	void userLeft(Long battleId, Long userId);

	OpenViduTokenResponseDto getToken(Long battleId, User user) throws
		OpenViduJavaClientException, OpenViduHttpException;

	RedisTopicDto<OpenViduTokenResponseDto> changeRole(Long battleId, Long userId, String connectionId);

}

