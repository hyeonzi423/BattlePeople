package com.woowahanrabbits.battle_people.domain.vote.controller;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.woowahanrabbits.battle_people.domain.vote.dto.VoteRequest;
import com.woowahanrabbits.battle_people.domain.vote.service.VoteService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class VoteMessageController {

	private final VoteService voteService;
	private final RedisTemplate<String, Object> redisTemplate;

	@MessageMapping("/vote/{battleBoardId}")
	public void sendUserVoteResult(@DestinationVariable Long battleBoardId, VoteRequest voteRequest) {
		String key = "vote";

		redisTemplate.convertAndSend(key,
			voteService.putLiveVote(battleBoardId, voteRequest));
	}

}
