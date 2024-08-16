package com.woowahanrabbits.battle_people.domain.vote.dto;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class VoteSubscriber {

	private final SimpMessagingTemplate template;
	private final ObjectMapper objectMapper;

	public VoteSubscriber(SimpMessagingTemplate template, ObjectMapper objectMapper) {
		this.template = template;
		this.objectMapper = objectMapper;
	}

	public void handleMessage(String message) {
		try {
			CurrentVoteResponseDto voteResponse = objectMapper.readValue(message, CurrentVoteResponseDto.class);
			template.convertAndSend("/topic/voteResults", voteResponse);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
