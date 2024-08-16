package com.woowahanrabbits.battle_people.domain.vote.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;
import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleBoardRepository;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.resolver.LoginUser;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.dto.CurrentVoteResponseDto;
import com.woowahanrabbits.battle_people.domain.vote.dto.LiveCurrentVoteResponseDto;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteInfoRepository;
import com.woowahanrabbits.battle_people.domain.vote.service.VoteService;
import com.woowahanrabbits.battle_people.validation.VoteValidator;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/vote")
@RequiredArgsConstructor
public class VoteController {
	private final VoteService voteService;
	private final BattleBoardRepository battleBoardRepository;
	private final VoteValidator voteValidator;
	private final VoteInfoRepository voteInfoRepository;

	@PostMapping("/user-vote-battle/{battleId}")
	@Operation(summary = "[]")
	public ResponseEntity<ApiResponseDto<CurrentVoteResponseDto>> putUserVote(@PathVariable Long battleId,
		@RequestParam Integer voteOpinionIndex,
		@LoginUser User user) {
		BattleBoard battleBoard = battleBoardRepository.findById(battleId).orElseThrow();
		voteValidator.validateBattleState(battleBoard.getVoteInfo().getCurrentState(), 4);
		Long voteId = battleBoard.getVoteInfo().getId();
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "",
				voteService.putVoteOpinion(user.getId(), voteId, voteOpinionIndex)));

	}

	@PostMapping("/user-vote-balance-game/{voteInfoId}")
	@Operation(summary = "[]")
	public ResponseEntity<ApiResponseDto<CurrentVoteResponseDto>> putUserVoteBalanceGame(@PathVariable Long voteInfoId,
		@RequestParam Integer voteOpinionIndex,
		@LoginUser User user) {
		VoteInfo voteInfo = voteInfoRepository.findById(voteInfoId).orElseThrow();
		voteValidator.validateBattleState(voteInfo.getCurrentState(), 5);
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "",
				voteService.putVoteOpinion(user.getId(), voteInfoId, voteOpinionIndex)));

	}

	@GetMapping("/user-vote/{battleId}")
	@Operation(summary = "[]")
	public ResponseEntity<ApiResponseDto<CurrentVoteResponseDto>> getUserVote(@PathVariable Long battleId) {
		try {
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponseDto<>("success", "",
					voteService.getVoteResult(battleId)));
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponseDto<>("fail", "", null));
		}
	}

	@GetMapping("/live-user-vote-result/{battleId}")
	@Operation(summary = "[]")
	public ResponseEntity<ApiResponseDto<LiveCurrentVoteResponseDto>> getLiveUserVote(@PathVariable Long battleId,
		@LoginUser User user) {
		try {
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponseDto<>("success", "",
					voteService.getVoteLiveResult(battleId, user.getId())));
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponseDto<>("fail", "", null));
		}
	}

	@GetMapping("/live-user-vote-opinion/{battleId}")
	@Operation(summary = "[]")
	public ResponseEntity<ApiResponseDto<Integer>> getUserLiveVoteOption(@PathVariable Long battleId,
		@LoginUser User user) {
		try {
			BattleBoard battleBoard = battleBoardRepository.findById(battleId).orElse(null);

			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponseDto<>("success", "",
					voteService.getUserLiveVoteOpinion(battleBoard.getVoteInfo().getId(), user.getId())));
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponseDto<>("fail", "", null));
		}
	}

}
