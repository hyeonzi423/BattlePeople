package com.woowahanrabbits.battle_people.domain.live.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleRepository;
import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicDto;
import com.woowahanrabbits.battle_people.domain.live.dto.request.WriteChatRequestDto;
import com.woowahanrabbits.battle_people.domain.live.dto.response.WriteChatResponseDto;
import com.woowahanrabbits.battle_people.domain.live.dto.response.WriteTalkResponseDto;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.dto.BasicUserDto;
import com.woowahanrabbits.battle_people.domain.user.infrastructure.UserRepository;
import com.woowahanrabbits.battle_people.domain.vote.domain.UserVoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.UserVoteOpinionRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteOpinionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class LiveChatServiceImpl implements LiveChatService {

	private final UserVoteOpinionRepository userVoteOpinionRepository;
	private final BattleRepository battleRepository;
	private final VoteOpinionRepository voteOpinionRepository;
	private static int chatIdx = 0;
	private static int requestIdx = 0;
	private final UserRepository userRepository;
	private final RedisTemplate<String, Object> redisTemplate;

	@Override
	public RedisTopicDto saveMessage(Long battleBoardId, WriteChatRequestDto writeChatRequestDto) {

		BasicUserDto user = new BasicUserDto(userRepository.findById(writeChatRequestDto.getUserId()).orElseThrow());

		WriteChatResponseDto writeChatResponseDto = WriteChatResponseDto.builder()
			.user(user)
			.message(writeChatRequestDto.getMessage())
			.build();

		VoteInfo voteInfo = battleRepository.findById(battleBoardId).orElseThrow().getVoteInfo();
		UserVoteOpinion userVoteOpinion = userVoteOpinionRepository.findByUserIdAndVoteInfoId(user.getId(),
			voteInfo.getId());
		Integer userVote = (userVoteOpinion != null) ? userVoteOpinion.getVoteInfoIndex() : null;
		writeChatResponseDto.setUserVote(userVote);
		writeChatResponseDto.setIdx(chatIdx++);

		RedisTopicDto redisTopicDto = RedisTopicDto.builder()
			.channelId(battleBoardId)
			.type("chat")
			.responseDto(writeChatResponseDto)
			.build();

		return redisTopicDto;

	}

	@Override
	public RedisTopicDto saveRequest(Long battleBoardId, User user, String connectionId) {
		VoteInfo voteInfo = battleRepository.findById(battleBoardId)
			.orElseThrow()
			.getVoteInfo();
		UserVoteOpinion userVoteOpinion = userVoteOpinionRepository.findByUserIdAndVoteInfoId(user.getId(),
			voteInfo.getId());
		if (userVoteOpinion == null) {
			throw new RuntimeException();
		}

		List<VoteOpinion> voteOpinions = voteOpinionRepository.findByVoteInfoId(voteInfo.getId());

		WriteTalkResponseDto writeTalkResponseDto = WriteTalkResponseDto.builder()
			.hostUserId(voteOpinions.get(userVoteOpinion.getVoteInfoIndex()).getUser().getId())
			.requestUserId(user.getId())
			.idx(requestIdx++)
			.userVote(userVoteOpinion.getVoteInfoIndex())
			.nickname(user.getNickname())
			.connectionId(connectionId)
			.rating(user.getRating())
			.build();

		RedisTopicDto redisTopicDto = RedisTopicDto.builder()
			.channelId(battleBoardId)
			.type("speak")
			.responseDto(writeTalkResponseDto)
			.build();

		ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();
		valueOps.set("private-request:" + battleBoardId + ":" + user.getId(),
			userVoteOpinion.getVoteInfoIndex() + "-" + user.getId() + "-" + connectionId);

		return redisTopicDto;

	}

	@Override
	public List<WriteTalkResponseDto> getRequestList(Long battleBoardId, Long userId) {
		BattleBoard battleBoard = battleRepository.findById(battleBoardId).orElse(null);
		if (battleBoard == null || (battleBoard.getOppositeUser().getId() != userId
			&& battleBoard.getRegistUser().getId() != userId)) {
			return new ArrayList<>();
		}

		int index = 0;
		if (battleBoard.getOppositeUser().getId() == userId) {
			index = 1;
		}

		List<WriteTalkResponseDto> responseDtoList = new ArrayList<>();

		List<Object> values = redisTemplate.opsForValue().multiGet(getKeysByPattern(battleBoardId));

		if (values != null) {
			for (Object value : values) {
				String[] strings = value.toString().split("-");
				if (strings.length != 3) {
					continue;
				}

				int opinionIndex = Integer.parseInt(strings[0]);
				Long requestUserId = Long.parseLong(strings[1]);

				User requestUser = userRepository.findById(requestUserId).orElse(null);

				if (opinionIndex != index && requestUser == null) {
					continue;
				}

				assert requestUser != null;
				responseDtoList.add(WriteTalkResponseDto.builder()
					.userVote(opinionIndex)
					.requestUserId(requestUserId)
					.hostUserId(userId)
					.connectionId(strings[2])
					.idx(requestIdx++)
					.nickname(requestUser.getNickname())
					.rating(requestUser.getRating())
					.build()
				);
			}

		}

		return responseDtoList;
	}

	@Override
	public Integer isUserSendRequest(Long battleBoardId, Long userId) {
		ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();
		if (valueOps.get("private-request:" + battleBoardId + ":" + userId) != null) {
			return 1;
		}
		return 0;
	}

	public List<String> getKeysByPattern(Long battleBoardId) {
		String pattern = "private-request:" + battleBoardId + ":*";
		List<String> keys = new ArrayList<>();

		// SCAN 명령을 실행
		redisTemplate.execute((RedisCallback<Void>)connection -> {
			Cursor<byte[]> cursor = connection.scan(ScanOptions.scanOptions().match(pattern).count(30).build());
			while (cursor.hasNext()) {
				keys.add(new String(cursor.next()));
			}
			return null;
		});

		return keys;
	}

}
