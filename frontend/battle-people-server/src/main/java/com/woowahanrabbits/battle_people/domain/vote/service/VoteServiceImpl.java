package com.woowahanrabbits.battle_people.domain.vote.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.woowahanrabbits.battle_people.config.AppProperties;
import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleApplyUserRepository;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleBoardRepository;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleRepository;
import com.woowahanrabbits.battle_people.domain.battle.service.BattleService;
import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicCustomDto;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.infrastructure.UserRepository;
import com.woowahanrabbits.battle_people.domain.vote.domain.UserVoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.dto.CurrentVoteResponseDto;
import com.woowahanrabbits.battle_people.domain.vote.dto.LiveCurrentVoteResponseDto;
import com.woowahanrabbits.battle_people.domain.vote.dto.UserWinHistory;
import com.woowahanrabbits.battle_people.domain.vote.dto.VoteOpinionDtoWithVoteCount;
import com.woowahanrabbits.battle_people.domain.vote.dto.VoteRequest;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.UserVoteOpinionRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteInfoRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteOpinionRepository;
import com.woowahanrabbits.battle_people.validation.VoteValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteServiceImpl implements VoteService {

	private final VoteInfoRepository voteInfoRepository;
	private final VoteOpinionRepository voteOpinionRepository;
	private final BattleBoardRepository battleBoardRepository;
	private final UserVoteOpinionRepository userVoteOpinionRepository;
	private final UserRepository userRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final ObjectMapper objectMapper;
	private final BattleRepository battleRepository;
	private final BattleApplyUserRepository battleApplyUserRepository;
	private final BattleService battleService;
	private final AppProperties appProperties;
	private final VoteValidator voteValidator;

	@Override
	public void addVoteInfo(VoteInfo voteInfo) {
		voteInfoRepository.save(voteInfo);
	}

	@Override
	public void addVoteOpinion(VoteOpinion voteOpinion) {
		voteOpinionRepository.save(voteOpinion);
	}

	@Override
	public Integer getUserLiveVoteOpinion(Long voteInfoId, Long userId) {
		UserVoteOpinion userVoteOpinion = userVoteOpinionRepository.findByUserIdAndVoteInfoId(userId, voteInfoId);
		if (userVoteOpinion == null) {
			return -1;
		}
		return userVoteOpinion.getVoteInfoIndex();
	}

	@Override
	public CurrentVoteResponseDto putVoteOpinion(Long userId, Long voteInfoId, int voteInfoIndex) {
		UserVoteOpinion userVoteOpinion = userVoteOpinionRepository.findByUserIdAndVoteInfoId(userId, voteInfoId);
		User user = userRepository.findById(userId).orElseThrow();
		VoteInfo voteInfo = voteInfoRepository.findById(voteInfoId).orElseThrow();

		if (userVoteOpinion != null) {
			userVoteOpinion.setVoteInfoIndex(voteInfoIndex);
			userVoteOpinionRepository.save(userVoteOpinion);
		} else {
			userVoteOpinion = UserVoteOpinion.builder()
				.voteInfo(voteInfo)
				.user(user)
				.voteInfoIndex(voteInfoIndex)
				.build();
			userVoteOpinionRepository.save(userVoteOpinion);
		}
		CurrentVoteResponseDto responseDto = resultDto(voteInfoId);

		return responseDto;
	}

	@Override
	public CurrentVoteResponseDto getVoteResult(Long battleBoardId) {
		Long voteInfoId = battleBoardRepository.findById(battleBoardId)
			.orElseThrow(() -> new RuntimeException("BattleBoard not found"))
			.getVoteInfo()
			.getId();

		return resultDto(voteInfoId);
	}

	@Override
	public LiveCurrentVoteResponseDto getVoteLiveResult(Long battleBoardId, Long userId) {
		Long voteInfoId = battleBoardRepository.findById(battleBoardId)
			.orElseThrow(() -> new RuntimeException("BattleBoard not found"))
			.getVoteInfo()
			.getId();

		UserVoteOpinion userVoteOpinion = userVoteOpinionRepository.findByUserIdAndVoteInfoId(userId, voteInfoId);

		Integer index = -1;
		if (userVoteOpinion != null) {
			index = userVoteOpinion.getVoteInfoIndex();
		}

		CurrentVoteResponseDto currentVoteResponseDto = resultDto(voteInfoId);
		return new LiveCurrentVoteResponseDto(currentVoteResponseDto.getTotalCount(),
			currentVoteResponseDto.getOpinions(), index);
	}

	@Override
	public RedisTopicCustomDto<List<VoteOpinionDtoWithVoteCount>> putLiveVote(Long battleBoardId,
		VoteRequest voteRequest) {
		BattleBoard battleBoard = battleBoardRepository.findById(battleBoardId).orElse(null);

		if (battleBoard == null) {
			return null;
		}

		CurrentVoteResponseDto currentVoteResponseDto;
		if (battleBoard.getRegistUser().getId() == voteRequest.getUserId()
			|| battleBoard.getOppositeUser().getId() == voteRequest.getUserId()) {
			currentVoteResponseDto = resultDto(battleBoard.getVoteInfo().getId());
		} else {
			currentVoteResponseDto = putVoteOpinion(voteRequest.getUserId(),
				battleBoard.getVoteInfo().getId(), voteRequest.getVoteInfoIndex());
		}

		RedisTopicCustomDto redisTopicDto = RedisTopicCustomDto.builder()
			.channelId(battleBoardId)
			.type("vote")
			.responseDto(currentVoteResponseDto.getOpinions())
			.userVoteOpinion(voteRequest.getVoteInfoIndex())
			.build();

		return redisTopicDto;
	}

	@Override
	public UserWinHistory getUserWinHistory(User user) {
		List<UserVoteOpinion> userVoteHistory = userVoteOpinionRepository.findWinRateByUserId(user.getId());
		int debateCnt = userVoteHistory.size();
		List<BattleBoard> myLives = battleRepository.findMyEndLives(user.getId());
		debateCnt += myLives.size();

		if (debateCnt == 0) {
			return new UserWinHistory(0, 0, 0, 0);
		}
		int winCnt = 0;

		for (UserVoteOpinion userVoteOpinion : userVoteHistory) {
			int myChoice = userVoteOpinion.getVoteInfoIndex();
			List<VoteOpinion> result = voteOpinionRepository.findAllByVoteInfoId(userVoteOpinion.getVoteInfoId());
			int opinionA = result.get(0).getFinalCount();
			int opinionB = result.get(1).getFinalCount();

			if (myChoice == 0 && opinionA > opinionB) {
				winCnt++;
			} else if (myChoice == 1 && opinionA < opinionB) {
				winCnt++;
			}
		}

		for (BattleBoard battleBoard : myLives) {
			VoteInfo voteInfo = battleBoard.getVoteInfo();
			if (voteInfo.getCurrentState() != 8) {
				continue;
			}

			int myChoice = 0;
			if (battleBoard.getOppositeUser().getId() == user.getId()) {
				myChoice = 1;
			}

			List<VoteOpinion> result = voteOpinionRepository.findAllByVoteInfoId(voteInfo.getId());
			int opinionA = result.get(0).getFinalCount();
			int opinionB = result.get(1).getFinalCount();

			if (myChoice == 0 && opinionA > opinionB) {
				winCnt++;
			} else if (myChoice == 1 && opinionA < opinionB) {
				winCnt++;
			}
		}

		int loseCnt = debateCnt - winCnt;
		int winRate = (winCnt * 100) / debateCnt;
		return new UserWinHistory(debateCnt, winCnt, loseCnt, winRate);
	}

	private CurrentVoteResponseDto resultDto(Long voteInfoId) {
		List<UserVoteOpinion> userVoteOpinionsOpt1 = userVoteOpinionRepository.findByVoteInfoIdAndVoteInfoIndex(
			voteInfoId, 0);
		List<UserVoteOpinion> userVoteOpinionsOpt2 = userVoteOpinionRepository.findByVoteInfoIdAndVoteInfoIndex(
			voteInfoId, 1);

		int voteCountOpt1 = userVoteOpinionsOpt1.size();
		int voteCountOpt2 = userVoteOpinionsOpt2.size();

		int totalCount = voteCountOpt1 + voteCountOpt2;

		int votePerOpt1 = 0;
		int votePerOpt2 = 0;

		if (totalCount != 0) {
			votePerOpt1 = 100 * voteCountOpt1 / totalCount;
			votePerOpt2 = 100 - votePerOpt1;
		}

		List<VoteOpinion> voteOpinions = voteOpinionRepository.findByVoteInfoId(voteInfoId);

		List<VoteOpinionDtoWithVoteCount> opinions = new ArrayList<>();
		opinions.add(new VoteOpinionDtoWithVoteCount(0, voteOpinions.get(0).getOpinion(), voteCountOpt1,
			votePerOpt1));

		opinions.add(new VoteOpinionDtoWithVoteCount(1, voteOpinions.get(1).getOpinion(), voteCountOpt2,
			votePerOpt2));

		return new CurrentVoteResponseDto(voteCountOpt1 + voteCountOpt2, opinions);
	}

	@Override
	public CurrentVoteResponseDto getVoteResultByVoteInfoId(Long voteInfoId) {
		return resultDto(voteInfoId);
	}

}
