package com.woowahanrabbits.battle_people.domain.live.controller;

import java.util.LinkedHashMap;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleRepository;
import com.woowahanrabbits.battle_people.domain.live.dto.ItemRequestDto;
import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicDto;
import com.woowahanrabbits.battle_people.domain.live.dto.request.RoleAcceptRequestDto;
import com.woowahanrabbits.battle_people.domain.live.dto.request.SocketRequestDto;
import com.woowahanrabbits.battle_people.domain.live.dto.request.WriteChatRequestDto;
import com.woowahanrabbits.battle_people.domain.live.dto.request.WriteTalkRequestDto;
import com.woowahanrabbits.battle_people.domain.live.service.LiveChatService;
import com.woowahanrabbits.battle_people.domain.live.service.OpenViduService;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.infrastructure.UserRepository;
import com.woowahanrabbits.battle_people.domain.vote.dto.VoteRequest;
import com.woowahanrabbits.battle_people.domain.vote.service.VoteService;
import com.woowahanrabbits.battle_people.validation.BattleValidator;
import com.woowahanrabbits.battle_people.validation.VoteValidator;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LiveChatController {

	private final LiveChatService liveChatService;
	private final OpenViduService openViduService;
	private final VoteService voteService;
	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;

	private final SimpMessagingTemplate messagingTemplate;
	private final UserRepository userRepository;
	private final BattleValidator battleValidator;
	private final VoteValidator voteValidator;
	private final BattleRepository battleRepository;

	@MessageMapping("/chat/{battleBoardId}")
	public void sendMessage(@DestinationVariable Long battleBoardId, WriteChatRequestDto writeChatRequestDto) {
		String key = "chat";
		BattleBoard battleBoard = battleRepository.findById(battleBoardId).orElseThrow();
		voteValidator.validateBattleState(battleBoard.getVoteInfo().getCurrentState(), 4);
		redisTemplate.convertAndSend(key, liveChatService.saveMessage(battleBoardId, writeChatRequestDto));
	}

	@MessageMapping("/live/{battleBoardId}")
	public void sendLiveBattleAction(@DestinationVariable Long battleBoardId,
		SocketRequestDto<?> liveBattleActionRequestDto) {
		String type = liveBattleActionRequestDto.getType();

		String key = "live";
		ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();

		BattleBoard battleBoard = battleRepository.findById(battleBoardId).orElseThrow();
		voteValidator.validateBattleState(battleBoard.getVoteInfo().getCurrentState(), 4);
		if (type == null) {
			return;
		}
		if (type.equals("item")) {
			LinkedHashMap<?, ?> map = (LinkedHashMap<?, ?>)liveBattleActionRequestDto.getData();
			ItemRequestDto itemRequestDto = objectMapper.convertValue(map, ItemRequestDto.class);
			redisTemplate.convertAndSend("live",
				RedisTopicDto.builder().channelId(battleBoardId).type("item").responseDto(itemRequestDto).build());
		}
		if (type.equals("speak")) {
			sendRequestToRegisterOrOpposite(battleBoardId, valueOps, liveBattleActionRequestDto.getData());
		}
		if (type.equals("vote")) {
			LinkedHashMap<?, ?> map = (LinkedHashMap<?, ?>)liveBattleActionRequestDto.getData();
			VoteRequest voteRequest = objectMapper.convertValue(map, VoteRequest.class);
			redisTemplate.convertAndSend("live",
				voteService.putLiveVote(battleBoardId, voteRequest));
		}

	}

	private void sendRequestToRegisterOrOpposite(Long battleBoardId, ValueOperations<String, Object> valueOps,
		Object data) {
		String key = "private-request";

		LinkedHashMap<?, ?> map = (LinkedHashMap<?, ?>)data;
		WriteTalkRequestDto writeTalkRequestDto = objectMapper.convertValue(map, WriteTalkRequestDto.class);
		Long userId = writeTalkRequestDto.getUserId();
		String connectionId = writeTalkRequestDto.getConnectionId();

		// 요청 저장
		User user = userRepository.findById(userId).orElse(null);
		if (valueOps.get("private-request:" + battleBoardId + ":" + user.getId()) != null) {
			throw new RuntimeException("User with id " + userId + " has already sent a request.");
		}

		redisTemplate.convertAndSend("live", liveChatService.saveRequest(battleBoardId, user, connectionId));

	}

	@MessageMapping("/request/{channel}")
	public void sendRequest(@DestinationVariable String channel, RoleAcceptRequestDto roleAcceptRequestDto) {
		Long battleBoardId = Long.parseLong(channel.split("-")[0]);
		Long userId = Long.parseLong(channel.split("-")[1]);

		String key = "private-request";
		ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();
		if (valueOps.get(key + ":" + battleBoardId + ":" + userId) != null) {
			valueOps.getOperations().delete(key + ":" + battleBoardId + ":" + userId);
			redisTemplate.convertAndSend("request", openViduService.changeRole(battleBoardId, userId,
				roleAcceptRequestDto.getConnectionId()));
		}

	}

}
