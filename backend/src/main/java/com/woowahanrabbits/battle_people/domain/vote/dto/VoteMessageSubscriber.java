package com.woowahanrabbits.battle_people.domain.vote.dto;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VoteMessageSubscriber implements MessageListener {

	private final SimpMessagingTemplate messagingTemplate;
	private final ObjectMapper objectMapper;

	@Override
	public void onMessage(Message message, byte[] pattern) {
		try {
			String channel = new String(pattern);
			String payload = new String(message.getBody());
			String battleBoardId = channel.substring(channel.lastIndexOf("-") + 1);
			CurrentVoteResponseDto voteResult = objectMapper.readValue(payload, CurrentVoteResponseDto.class);
			messagingTemplate.convertAndSend("/topic/live-voteResults/" + battleBoardId, voteResult);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
