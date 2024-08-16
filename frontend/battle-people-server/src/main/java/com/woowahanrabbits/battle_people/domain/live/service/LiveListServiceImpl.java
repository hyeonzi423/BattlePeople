package com.woowahanrabbits.battle_people.domain.live.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleBoardRepository;
import com.woowahanrabbits.battle_people.domain.live.dto.LiveEndDetailDto;
import com.woowahanrabbits.battle_people.domain.live.dto.LiveListResponseDto;
import com.woowahanrabbits.battle_people.domain.live.infrastructure.LiveApplyUserRepository;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteOpinionRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LiveListServiceImpl implements LiveListService {
	private final BattleBoardRepository battleBoardRepository;
	private final VoteOpinionRepository voteOpinionRepository;
	private final LiveApplyUserRepository liveApplyUserRepository;

	@Override
	public Page<LiveListResponseDto> getActiveLiveList(String keyword, Integer category, Pageable pageable) {
		if (category == null) {
			return battleBoardRepository.findAllActiveBattleBoards(new Date(), keyword, pageable)
				.map(this::convertToDto);
		}

		return battleBoardRepository.findAllActiveBattleBoardsByCategory(new Date(), keyword, category, pageable)
			.map(this::convertToDto);
	}

	@Override
	public Page<LiveListResponseDto> getWaitLiveList(String keyword, Integer category, Pageable pageable) {
		Date currentTime = new Date();

		if (category == null) {
			return battleBoardRepository.findAllWaitBattleBoards(currentTime, keyword, pageable)
				.map(this::convertToDto);
		}

		return battleBoardRepository.findAllWaitBattleBoardsByCategory(currentTime, keyword,
			category, pageable).map(this::convertToDto);
	}

	@Override
	public Page<LiveListResponseDto> getEndLiveList(String keyword, Integer category, Pageable pageable) {
		if (category == null) {
			return battleBoardRepository.findAllEndBattleBoards(new Date(), keyword, pageable).map(this::convertToDto);
		}

		return battleBoardRepository.findAllEndBattleBoardsByCategory(new Date(), keyword, category, pageable)
			.map(this::convertToDto);
	}

	@Override
	public LiveListResponseDto getLiveInfo(Long battleId) {
		Optional<BattleBoard> optionalBattleBoard = battleBoardRepository.findById(battleId);
		if (optionalBattleBoard.isPresent()) {
			BattleBoard battleBoard = optionalBattleBoard.get();

			return convertToDto(battleBoard);
		} else {
			throw new EntityNotFoundException("BattleBoard not found with id " + battleId);
		}
	}

	@Override
	public LiveEndDetailDto getEndLiveSummary(Long battleId) {
		BattleBoard battleBoard = battleBoardRepository.findById(battleId).orElse(null);
		if (battleBoard != null) {
			return convertToEndDetailDto(battleBoard);
		}
		return null;
	}

	private LiveEndDetailDto convertToEndDetailDto(BattleBoard battleBoard) {
		List<VoteOpinion> voteOpinions = voteOpinionRepository.findAllByVoteInfoId(battleBoard.getVoteInfo().getId());
		VoteInfo voteInfo = battleBoard.getVoteInfo();

		if (voteOpinions.size() < 2) {
			return null;
		}

		User registUser = battleBoard.getRegistUser();
		User oppositeUser = battleBoard.getOppositeUser();

		int registPreCount = voteOpinions.get(0).getPreCount() == null ? 0 : voteOpinions.get(0).getPreCount();
		int oppositePreCount = voteOpinions.get(1).getPreCount() == null ? 0 : voteOpinions.get(1).getPreCount();
		int registFinalCount =
			voteOpinions.get(0).getFinalCount() == null ? 0 : voteOpinions.get(0).getFinalCount();
		int oppositeFinalCount =
			voteOpinions.get(1).getFinalCount() == null ? 0 : voteOpinions.get(1).getFinalCount();

		int registPrePercent = 0;
		int oppositePrePercent = 0;
		int registFinalPercent = 0;
		int oppositeFinalPercent = 0;

		if (registPreCount + oppositePreCount > 0) {
			registPrePercent = 100 * registPreCount / (registPreCount + oppositePreCount);
			oppositePrePercent = 100 - registPrePercent;
		}
		if (registFinalCount + oppositeFinalCount > 0) {
			registFinalPercent = 100 * registFinalCount / (registFinalCount + oppositeFinalCount);
			oppositeFinalPercent = 100 - registFinalPercent;
		}

		return new LiveEndDetailDto(
			battleBoard.getId(),
			voteInfo.getTitle(),
			new LiveEndDetailDto.BroadcastUser(registUser.getId(), registUser.getNickname(), registUser.getImgUrl(),
				registUser.getRating(), voteOpinions.get(0).getOpinion()),
			new LiveEndDetailDto.BroadcastUser(oppositeUser.getId(), oppositeUser.getNickname(),
				oppositeUser.getImgUrl(), oppositeUser.getRating(), voteOpinions.get(1).getOpinion()),
			new LiveEndDetailDto.VoteResult(registPrePercent, oppositePrePercent),
			new LiveEndDetailDto.VoteResult(registPreCount, oppositePreCount),
			new LiveEndDetailDto.VoteResult(registFinalPercent, oppositeFinalPercent),
			new LiveEndDetailDto.VoteResult(registFinalCount, oppositeFinalCount),
			voteInfo.getCategory(),
			battleBoard.getImageUrl(),
			battleBoard.getVoteInfo().getDetail()
		);
	}

	private LiveListResponseDto convertToDto(BattleBoard battleBoard) {
		List<VoteOpinion> voteOpinions = voteOpinionRepository.findAllByVoteInfoId(battleBoard.getVoteInfo().getId());

		if (voteOpinions.size() < 2) {
			return null;
		}

		User registUser = battleBoard.getRegistUser();
		User oppositeUser = battleBoard.getOppositeUser();

		return new LiveListResponseDto(
			battleBoard.getId(),
			battleBoard.getVoteInfo().getTitle(),
			new LiveListResponseDto.BroadcastUser(registUser.getId(), registUser.getNickname(), registUser.getImgUrl(),
				registUser.getRating(), voteOpinions.get(0).getOpinion()),
			new LiveListResponseDto.BroadcastUser(oppositeUser.getId(), oppositeUser.getNickname(),
				oppositeUser.getImgUrl(), oppositeUser.getRating(), voteOpinions.get(1).getOpinion()),
			battleBoard.getVoteInfo().getStartDate(),
			battleBoard.getVoteInfo().getEndDate(),
			liveApplyUserRepository.countByBattleBoardId(battleBoard.getId()),
			battleBoard.getVoteInfo().getCategory(),
			battleBoard.getImageUrl(),
			battleBoard.getBattleRule(),
			battleBoard.getVoteInfo().getDetail()

		);

	}

}
