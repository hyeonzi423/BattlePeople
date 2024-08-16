package com.woowahanrabbits.battle_people.domain.vote.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleApplyUserRepository;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.UserVoteOpinionRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteOpinionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteScheduler {

	private final UserVoteOpinionRepository userVoteOpinionRepository;
	private final VoteOpinionRepository voteOpinionRepository;
	private final BattleApplyUserRepository battleApplyUserRepository;

	public void updatePreVoteCount(BattleBoard battleBoard) {
		List<VoteOpinion> voteOpinions = voteOpinionRepository.findAllByVoteInfoId(battleBoard.getVoteInfo().getId());
		for (VoteOpinion voteOpinion : voteOpinions) {
			int preCount = battleApplyUserRepository.countByBattleBoardIdAndSelectedOpinion(battleBoard.getId(),
				voteOpinion.getVoteOpinionIndex());
			voteOpinion.setPreCount(preCount);
			voteOpinionRepository.save(voteOpinion);
		}
	}

	public int updateFinalVoteCount(VoteInfo voteInfo) {
		List<VoteOpinion> voteOpinions = voteOpinionRepository.findAllByVoteInfoId(voteInfo.getId());
		for (int idx = 0; idx < 2; idx++) {
			int finalCount = userVoteOpinionRepository.countByVoteInfoIdAndVoteInfoIndex(
				voteInfo.getId(), voteOpinions.get(idx).getVoteOpinionIndex());
			voteOpinions.get(idx).setFinalCount(finalCount);
			voteOpinionRepository.save(voteOpinions.get(idx));
		}
		if (voteOpinions.get(0).getFinalCount() == voteOpinions.get(1).getFinalCount()) {
			return -1;
		} else {
			return voteOpinions.get(0).getFinalCount() > voteOpinions.get(1).getFinalCount() ? 0 : 1;
		}
	}
}
