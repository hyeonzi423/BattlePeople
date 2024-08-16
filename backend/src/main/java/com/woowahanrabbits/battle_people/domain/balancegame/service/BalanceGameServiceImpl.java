package com.woowahanrabbits.battle_people.domain.balancegame.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.woowahanrabbits.battle_people.domain.balancegame.dto.BalanceGameResponse;
import com.woowahanrabbits.battle_people.domain.balancegame.dto.CreateBalanceGameRequest;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.vote.domain.UserVoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.dto.VoteOpinionDtoWithVoteCount;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.UserVoteOpinionRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteInfoRepository;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.VoteOpinionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BalanceGameServiceImpl implements BalanceGameService {

	private final VoteInfoRepository voteInfoRepository;
	private final VoteOpinionRepository voteOpinionRepository;
	private final UserVoteOpinionRepository userVoteOpinionRepository;

	@Override
	public void addBalanceGame(CreateBalanceGameRequest createBalanceGameRequest, User user) {

		Calendar calendar = Calendar.getInstance();
		Date now = new Date();
		calendar.setTime(createBalanceGameRequest.getStartDate());

		calendar.add(Calendar.DATE, 3);

		VoteInfo voteInfo = VoteInfo.builder()
			.title(createBalanceGameRequest.getTitle())
			.startDate(createBalanceGameRequest.getStartDate())
			.endDate(calendar.getTime())
			.category(createBalanceGameRequest.getCategory())
			.detail(createBalanceGameRequest.getDetail())
			.currentState(5)
			.build();
		voteInfoRepository.save(voteInfo);

		for (int i = 0; i < 2; i++) {
			VoteOpinion voteOpinion = VoteOpinion.builder()
				.voteOpinionIndex(i)
				.voteInfoId(voteInfo.getId())
				.user(user)
				.opinion(createBalanceGameRequest.getOpinions().get(i))
				.build();

			voteOpinionRepository.save(voteOpinion);
		}
	}

	@Override
	public List<BalanceGameResponse> getBalanceGameByConditions(Integer category, int status, int page,
		User user, int size) {
		Pageable pageable = PageRequest.of(page, size);
		System.out.println(size);
		List<VoteInfo> list = (category == null)
			? voteInfoRepository.findAllByCurrentStateOrderByIdDesc(status, pageable).getContent()
			: voteInfoRepository.findAllByCategoryAndCurrentStateOrderByIdDesc(category, status, pageable).getContent();

		List<BalanceGameResponse> returnList = new ArrayList<>();
		for (VoteInfo voteInfo : list) {
			BalanceGameResponse balanceGameResponse = getBalanceGameById(voteInfo.getId(), user);
			returnList.add(balanceGameResponse);
		}

		return returnList;
	}

	@Override
	public BalanceGameResponse getBalanceGameById(Long id, User user) {
		VoteInfo voteInfo = voteInfoRepository.findById(id).get();
		BalanceGameResponse balanceGameResponse = new BalanceGameResponse(voteInfo);

		List<VoteOpinion> voteOpinions = voteOpinionRepository.findByVoteInfoId(voteInfo.getId());
		List<VoteOpinionDtoWithVoteCount> voteOpinionDtoWithVoteCounts = convertToVoteOpinionDtos(voteInfo.getId(),
			voteOpinions);

		balanceGameResponse.setOpinions(voteOpinionDtoWithVoteCounts);
		if (user != null) {
			UserVoteOpinion uvo = userVoteOpinionRepository.findByUserIdAndVoteInfoId(user.getId(),
				voteInfo.getId());
			balanceGameResponse.setUserVote(uvo == null ? null : uvo.getVoteInfoIndex());
		}
		return balanceGameResponse;
	}

	private List<VoteOpinionDtoWithVoteCount> convertToVoteOpinionDtos(Long voteInfoId,
		List<VoteOpinion> voteOpinions) {

		if (voteOpinions.size() < 2) {
			return null;
		}

		List<UserVoteOpinion> userVoteOpinionsOpt1 = userVoteOpinionRepository.findByVoteInfoIdAndVoteInfoIndex(
			voteInfoId, 0);
		List<UserVoteOpinion> userVoteOpinionsOpt2 = userVoteOpinionRepository.findByVoteInfoIdAndVoteInfoIndex(
			voteInfoId, 1);

		int voteCountOpt1 = userVoteOpinionsOpt1.size();
		int voteCountOpt2 = userVoteOpinionsOpt2.size();
		int votePerOpt1 = 0;
		int votePerOpt2 = 0;

		int totalCount = voteCountOpt1 + voteCountOpt2;

		if (totalCount != 0) {
			votePerOpt1 = 100 * voteCountOpt1 / totalCount;
			votePerOpt2 = 100 - votePerOpt1;
		}

		List<VoteOpinionDtoWithVoteCount> voteOpinionDtoWithVoteCounts = new ArrayList<>();

		VoteOpinionDtoWithVoteCount voteOpinionDtoWithVoteCountRegist = new VoteOpinionDtoWithVoteCount(
			voteOpinions.get(0));
		VoteOpinionDtoWithVoteCount voteOpinionDtoWithVoteCountOpp = new VoteOpinionDtoWithVoteCount(
			voteOpinions.get(1));

		voteOpinionDtoWithVoteCountRegist.setPercentage(votePerOpt1);
		voteOpinionDtoWithVoteCountRegist.setCount(voteCountOpt1);

		voteOpinionDtoWithVoteCountOpp.setPercentage(votePerOpt2);
		voteOpinionDtoWithVoteCountOpp.setCount(voteCountOpt2);

		voteOpinionDtoWithVoteCounts.add(voteOpinionDtoWithVoteCountRegist);
		voteOpinionDtoWithVoteCounts.add(voteOpinionDtoWithVoteCountOpp);

		return voteOpinionDtoWithVoteCounts;
	}

}
