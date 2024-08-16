package com.woowahanrabbits.battle_people.domain.battle.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleApplyUser;
import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.dto.AwaitingBattleResponseDto;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleApplyDto;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleInfoDto;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleInviteRequest;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleRespondRequest;
import com.woowahanrabbits.battle_people.domain.battle.dto.BattleResponse;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleApplyUserRepository;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleRepository;
import com.woowahanrabbits.battle_people.domain.notify.domain.Notify;
import com.woowahanrabbits.battle_people.domain.notify.dto.NotificationDetailResponseDto;
import com.woowahanrabbits.battle_people.domain.notify.dto.NotificationType;
import com.woowahanrabbits.battle_people.domain.notify.infrastructure.NotifyRepository;
import com.woowahanrabbits.battle_people.domain.notify.service.NotifyService;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.dto.CreateLives;
import com.woowahanrabbits.battle_people.domain.user.infrastructure.UserRepository;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.dto.BattleOpinionDto;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteInfoRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteOpinionRepository;
import com.woowahanrabbits.battle_people.domain.vote.service.VoteScheduler;
import com.woowahanrabbits.battle_people.exception.CustomException;
import com.woowahanrabbits.battle_people.exception.ErrorCode;
import com.woowahanrabbits.battle_people.validation.BattleValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BattleServiceImpl implements BattleService {

	private final BattleRepository battleRepository;
	private final VoteOpinionRepository voteOpinionRepository;
	private final BattleApplyUserRepository battleApplyUserRepository;
	private final VoteInfoRepository voteInfoRepository;
	private final UserRepository userRepository;
	private final BattleValidator battleValidator;
	private final NotifyService notifyService;
	private final NotifyRepository notifyRepository;
	private final VoteScheduler voteScheduler;
	private final DalleService dalleService;

	@Value("${min.people.count.value}")
	private Integer minPeopleCount;

	@Transactional
	@Override
	public void registBattle(BattleInviteRequest battleInviteRequest, User user) {
		//endDate 설정
		LocalDateTime startDateTime = battleInviteRequest.getStartDate().toInstant()
			.atZone(ZoneId.systemDefault())
			.toLocalDateTime();
		LocalDateTime endDateTime = startDateTime.plusMinutes(battleInviteRequest.getTime());
		Date endDate = Date.from(endDateTime.atZone(ZoneId.systemDefault()).toInstant());

		battleValidator.checkOtherBattles(user, battleInviteRequest.getStartDate(), endDate);

		//VoteInfo 만들기
		VoteInfo voteInfo = VoteInfo.builder()
			.title(battleInviteRequest.getTitle())
			.startDate(battleInviteRequest.getStartDate())
			.endDate(endDate)
			.category(battleInviteRequest.getCategory())
			.currentState(0)
			.detail(battleInviteRequest.getDetail())
			.build();

		List<BattleBoard> myList = battleRepository.findMyAwaitingList(user.getId());
		for (BattleBoard awaitingBoard : myList) {
			VoteInfo awaitingVoteInfo = awaitingBoard.getVoteInfo();

			if (awaitingVoteInfo.getCurrentState() == 0) {
				if (awaitingBoard.getRegistUser().getId() != user.getId()) {
					continue;
				}
			}

			if (awaitingVoteInfo.getCurrentState() >= 5 || awaitingVoteInfo.getCurrentState() == 1) {
				continue;
			}

			if (awaitingVoteInfo.getStartDate().before(voteInfo.getEndDate()) && awaitingVoteInfo.getStartDate()
				.after(voteInfo.getStartDate())) {
				throw new CustomException(ErrorCode.DUPLICATED_BATTLE);
			}
			if (awaitingVoteInfo.getEndDate().after(voteInfo.getStartDate()) && awaitingVoteInfo.getEndDate()
				.before(voteInfo.getEndDate())) {
				throw new CustomException(ErrorCode.DUPLICATED_BATTLE);
			}
			if (awaitingVoteInfo.getStartDate().before(voteInfo.getStartDate()) && awaitingVoteInfo.getEndDate()
				.after(voteInfo.getStartDate())) {
				throw new CustomException(ErrorCode.DUPLICATED_BATTLE);
			}
			if (awaitingVoteInfo.getStartDate().after(voteInfo.getStartDate()) && awaitingVoteInfo.getEndDate()
				.before(voteInfo.getEndDate())) {
				throw new CustomException(ErrorCode.DUPLICATED_BATTLE);
			}
		}

		//투표 정보 저장
		voteInfoRepository.save(voteInfo);

		//VoteOpinion 만들기
		VoteOpinion voteOpinion = VoteOpinion.builder()
			.voteOpinionIndex(0)
			.voteInfoId(voteInfo.getId())
			.user(user)
			.opinion(battleInviteRequest.getOpinion())
			.build();
		voteOpinionRepository.save(voteOpinion);

		//battle board
		BattleBoard battleBoard = BattleBoard.builder()
			.registUser(user)
			.oppositeUser(userRepository.findById(battleInviteRequest.getOppositeUserId()).orElseThrow())
			.voteInfo(voteInfo)
			.maxPeopleCount(battleInviteRequest.getMaxPeopleCount())
			.battleRule(battleInviteRequest.getBattleRule())
			.build();
		battleRepository.save(battleBoard);
		System.out.println(user);

		notifyService.sendNotification(battleBoard.getOppositeUser(), battleBoard, NotificationType.BATTLE_REQUEST);
	}

	@Override
	public BattleResponse getReceivedBattle(Long id) {

		BattleBoard battleBoard = battleRepository.findById(id).orElseThrow();

		List<VoteOpinion> voteOpinions = voteOpinionRepository.findByVoteInfoId(
			battleBoard.getVoteInfo().getId());

		return new BattleResponse(battleBoard, voteOpinions.get(0));
	}

	@Override
	public NotificationDetailResponseDto getNotificationDetail(Long notifyId) {
		Notify notify = notifyRepository.findById(notifyId).get();
		NotificationDetailResponseDto notificationDetailResponseDto = new NotificationDetailResponseDto();

		int notifyCode = notify.getNotifyCode();

		notificationDetailResponseDto.setId(notifyId);
		notificationDetailResponseDto.setNotifyCode(notifyCode);
		notificationDetailResponseDto.setTitle(notify.getTitle());

		Long battleBoardId = notify.getBattleBoard().getId();

		if (notifyCode == 0) {
			//배틀정보
			BattleResponse battleResponse = getReceivedBattle(battleBoardId);
			notificationDetailResponseDto.setSpecificData((BattleResponse)battleResponse);
		} else if (notifyCode == 1) {
			notificationDetailResponseDto.setSpecificData((Long)battleBoardId);
		}

		notify.setRead(true);
		notifyRepository.save(notify);

		return notificationDetailResponseDto;
	}

	@Transactional
	@Override
	public void acceptOrDeclineBattle(BattleRespondRequest battleRespondRequest, User user) {
		BattleBoard battleBoard = battleRepository.findById(battleRespondRequest.getBattleId()).orElseThrow();
		VoteInfo requestVote = battleBoard.getVoteInfo();

		battleValidator.validateStartTime(battleBoard.getVoteInfo().getStartDate(), 0);

		if (battleRespondRequest.getRespond().equals("decline")) {
			requestVote.setCurrentState(1);
			voteInfoRepository.save(requestVote);
			battleBoard.setRejectionReason(battleRespondRequest.getContent());
			battleRepository.save(battleBoard);
			notifyService.sendNotification(battleBoard.getRegistUser(), battleBoard, NotificationType.BATTLE_DECLINE);
		} else if (battleRespondRequest.getRespond().equals("accept")) {

			//일정이 겹치는 라이브가 있는지 확인
			battleValidator.checkOtherBattles(user, battleBoard.getVoteInfo().getStartDate(),
				battleBoard.getVoteInfo().getEndDate());

			requestVote.setCurrentState(2);
			voteInfoRepository.save(requestVote);
			VoteOpinion voteOpinion = VoteOpinion.builder()
				.voteOpinionIndex(1)
				.voteInfoId(battleBoard.getVoteInfo().getId())
				.user(user)
				.opinion(battleRespondRequest.getContent())
				.build();
			voteOpinionRepository.save(voteOpinion);
			notifyService.sendNotification(battleBoard.getRegistUser(), battleBoard, NotificationType.BATTLE_ACCEPT);
		}
	}

	@Override
	public List<AwaitingBattleResponseDto> getAwaitingBattleList(Integer category, int page, User user, int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<VoteInfo> voteInfos = category == null
			? voteInfoRepository.findAllByCurrentStateOrderByIdDesc(2, pageable).getContent()
			:
			voteInfoRepository.findAllByCategoryAndCurrentStateOrderByIdDesc(category, 2, pageable).getContent();
		List<AwaitingBattleResponseDto> returnList = new ArrayList<>();

		for (VoteInfo voteInfo : voteInfos) {
			List<VoteOpinion> votes = voteOpinionRepository.findByVoteInfoId(voteInfo.getId());

			List<BattleOpinionDto> opinions = new ArrayList<>();
			for (VoteOpinion voteOpinion : votes) {
				opinions.add(new BattleOpinionDto(voteOpinion));
			}
			BattleBoard battleBoard = battleRepository.findByVoteInfoId(voteInfo.getId());
			int userCount = battleApplyUserRepository.countByBattleBoardId(battleBoard.getId());
			int maxPeopleCount = battleBoard.getMaxPeopleCount();

			if (user != null) {
				boolean isVoted = battleApplyUserRepository.existsByBattleBoardIdAndUserId(battleBoard.getId(),
					user.getId());
				AwaitingBattleResponseDto awaitingBattleResponseDto = new AwaitingBattleResponseDto(battleBoard,
					voteInfo, opinions,
					userCount, maxPeopleCount, isVoted);
				returnList.add(awaitingBattleResponseDto);
			} else {
				AwaitingBattleResponseDto awaitingBattleResponseDto = new AwaitingBattleResponseDto(battleBoard,
					voteInfo, opinions,
					userCount, maxPeopleCount);
				returnList.add(awaitingBattleResponseDto);
			}
		}
		return returnList;
	}

	@Transactional
	@Override
	public int applyBattle(BattleApplyDto battleApplyDto, User user) {
		BattleBoard battleBoard = battleRepository.findById(battleApplyDto.getBattleId()).orElseThrow();
		VoteInfo voteInfo = battleBoard.getVoteInfo();
		if (battleBoard.getOppositeUser().getId() == user.getId()
			|| battleBoard.getRegistUser().getId() == user.getId()) {
			//주최자는 참여 신청 X
			return -1;
		}

		int currentPeopleCount = battleApplyUserRepository.countByBattleBoardId(battleBoard.getId());

		if (battleApplyUserRepository.existsByBattleBoardIdAndUserId(battleBoard.getId(), user.getId())) {
			//이미 참여신청한 유저라면
			return -2;
		}

		//최대 인원
		if (currentPeopleCount >= battleBoard.getMaxPeopleCount()) {
			return -3;
		}

		// 이미 일정이 있는 유저라면
		List<BattleBoard> myList = battleRepository.findMyAwaitingList(user.getId());
		for (BattleBoard awaitingBoard : myList) {
			VoteInfo awaitingVoteInfo = awaitingBoard.getVoteInfo();

			if (voteInfo.getCurrentState() == 0 && awaitingBoard.getRegistUser().getId() != user.getId()) {
				continue;
			}

			if (voteInfo.getCurrentState() >= 5 || voteInfo.getCurrentState() == 1) {
				continue;
			}

			if (awaitingVoteInfo.getStartDate().before(voteInfo.getEndDate()) && awaitingVoteInfo.getStartDate()
				.after(voteInfo.getStartDate())) {
				return -4;
			}
			if (awaitingVoteInfo.getEndDate().after(voteInfo.getStartDate()) && awaitingVoteInfo.getEndDate()
				.before(voteInfo.getEndDate())) {
				return -4;
			}
			if (awaitingVoteInfo.getStartDate().before(voteInfo.getStartDate()) && awaitingVoteInfo.getEndDate()
				.after(voteInfo.getStartDate())) {
				return -4;
			}
			if (awaitingVoteInfo.getStartDate().after(voteInfo.getStartDate()) && awaitingVoteInfo.getEndDate()
				.before(voteInfo.getEndDate())) {
				return -4;
			}
		}

		BattleApplyUser battleApplyUser = BattleApplyUser.builder()
			.battleBoard(battleBoard)
			.user(user)
			.applyDate(new Date())
			.selectedOpinion(battleApplyDto.getSelectedOpinion())
			.build();
		battleApplyUserRepository.save(battleApplyUser);

		currentPeopleCount = battleApplyUserRepository.countByBattleBoardId(battleBoard.getId());

		//최대 인원 충족 체크
		if (currentPeopleCount >= battleBoard.getMaxPeopleCount()) {
			voteInfo.setCurrentState(3);
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

		//참여 신청한 인원 수 return
		return battleApplyUserRepository.countByBattleBoardId(battleBoard.getId());
	}

	@Override // 개최한 라이브 목록 조회
	public List<CreateLives> getBattleBoardsByUserId(Long userId) {
		List<BattleBoard> myLives = battleRepository.findMyEndLives(userId);
		List<CreateLives> returnList = new ArrayList<>();
		for (BattleBoard battleBoard : myLives) {
			if (battleBoard.getVoteInfo().getCurrentState() == 8) {
				List<VoteOpinion> voteOpinions = voteOpinionRepository.findAllByVoteInfoId(
					battleBoard.getVoteInfo().getId());

				int winIndex = 0;

				int opinionA = voteOpinions.get(0).getFinalCount();
				int opinionB = voteOpinions.get(1).getFinalCount();
				if (opinionA < opinionB) {
					winIndex = 1;
				} else if (opinionA == opinionB) {
					winIndex = 2;
				}
				returnList.add(new CreateLives(battleBoard, winIndex));
			} else {
				returnList.add(new CreateLives(battleBoard, 4));
			}
		}

		return returnList;
	}

}
