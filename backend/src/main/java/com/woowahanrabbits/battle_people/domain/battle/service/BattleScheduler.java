package com.woowahanrabbits.battle_people.domain.battle.service;

import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleInfoDto;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleApplyUserRepository;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleRepository;
import com.woowahanrabbits.battle_people.domain.notify.infrastructure.NotifyRepository;
import com.woowahanrabbits.battle_people.domain.notify.service.NotifyService;
import com.woowahanrabbits.battle_people.domain.user.service.UserService;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.UserVoteOpinionRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteInfoRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteOpinionRepository;
import com.woowahanrabbits.battle_people.domain.vote.service.VoteScheduler;

import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class BattleScheduler {

	private final VoteInfoRepository voteInfoRepository;
	private final BattleRepository battleRepository;
	private final BattleApplyUserRepository battleApplyUserRepository;
	private final VoteScheduler voteScheduler;
	private final NotifyService notifyService;
	private final NotifyRepository notifyRepository;
	private final VoteOpinionRepository voteOpinionRepository;
	private final DalleService dalleService;
	private final UserService userService;
	private final UserVoteOpinionRepository userVoteOpinionRepository;

	@Value("${min.people.count.value}")
	private Integer minPeopleCount;

	@Scheduled(cron = "0 * * * * *")
	public void checkCurrentState0() {
		Date now = new Date();
		List<VoteInfo> state1List = voteInfoRepository.findAllByStartDateBeforeAndCurrentState(now, 0);
		for (VoteInfo voteInfo : state1List) {
			voteInfo.setCurrentState(9);
			voteInfoRepository.save(voteInfo);
		}
	}

	@Scheduled(cron = "0 * * * * *")
	public void checkCurrentState2() {
		Date now = new Date();
		List<VoteInfo> state2List = voteInfoRepository.findAllByStartDateBeforeAndCurrentState(now, 2);
		for (VoteInfo voteInfo : state2List) {
			BattleBoard battleBoard = battleRepository.findByVoteInfoId(voteInfo.getId());
			int applyCount = battleApplyUserRepository.countByBattleBoardId(battleBoard.getId());
			if (applyCount < minPeopleCount) {
				voteInfo.setCurrentState(5);
				voteInfoRepository.save(voteInfo);
			} else {
				voteInfo.setCurrentState(4);
				voteInfoRepository.save(voteInfo);
				voteScheduler.updatePreVoteCount(battleBoard);
				List<VoteOpinion> voteOpinions = voteOpinionRepository.findAllByVoteInfoId(voteInfo.getId());
				BattleInfoDto battleInfoDto = new BattleInfoDto(battleBoard, voteInfo, voteOpinions);
				try {
					CompletableFuture<String> imageFuture = dalleService.generateImageAsync(battleInfoDto);
				} catch (Exception e) {
					// throw new RuntimeException(e);
				}
			}
		}
	}

	@Scheduled(cron = "0 * * * * *")
	public void checkCurrentState3() {
		Date now = new Date();
		List<VoteInfo> state3List = voteInfoRepository.findAllByStartDateBeforeAndCurrentState(now, 3);
		for (VoteInfo voteInfo : state3List) {
			BattleBoard battleBoard = battleRepository.findByVoteInfoId(voteInfo.getId());

			if (battleBoard.getImageUrl() == null) {
				List<VoteOpinion> voteOpinions = voteOpinionRepository.findAllByVoteInfoId(voteInfo.getId());
				BattleInfoDto battleInfoDto = new BattleInfoDto(battleBoard, voteInfo, voteOpinions);
				try {
					CompletableFuture<String> imageFuture = dalleService.generateImageAsync(battleInfoDto);
				} catch (Exception e) {
					// throw new RuntimeException(e);
				}
			}

			voteInfo.setCurrentState(4);
			voteInfoRepository.save(voteInfo);
			voteScheduler.updatePreVoteCount(battleBoard);
		}
	}

	@Scheduled(cron = "0 * * * * *")
	public void checkCurrentState4() {
		Date now = new Date();
		List<VoteInfo> state4List = voteInfoRepository.findAllByEndDateBeforeAndCurrentState(now, 4);
		for (VoteInfo voteInfo : state4List) {
			voteInfo.setCurrentState(8);
			voteInfoRepository.save(voteInfo);
			voteScheduler.updateFinalVoteCount(voteInfo);
		}
	}

	@Scheduled(cron = "0 * * * * *")
	public void checkCurrentState5() {
		Date now = new Date();
		List<VoteInfo> state4List = voteInfoRepository.findAllByEndDateBeforeAndCurrentState(now, 5);
		for (VoteInfo voteInfo : state4List) {
			voteInfo.setCurrentState(6);
			voteInfoRepository.save(voteInfo);
			voteScheduler.updateFinalVoteCount(voteInfo);
		}
	}

}
