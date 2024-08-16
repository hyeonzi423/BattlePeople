package com.woowahanrabbits.battle_people.domain.vote.service;

import java.util.List;

import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicCustomDto;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.dto.CurrentVoteResponseDto;
import com.woowahanrabbits.battle_people.domain.vote.dto.LiveCurrentVoteResponseDto;
import com.woowahanrabbits.battle_people.domain.vote.dto.UserWinHistory;
import com.woowahanrabbits.battle_people.domain.vote.dto.VoteOpinionDtoWithVoteCount;
import com.woowahanrabbits.battle_people.domain.vote.dto.VoteRequest;

public interface VoteService {
	void addVoteInfo(VoteInfo voteInfo);

	void addVoteOpinion(VoteOpinion voteOpinion);

	Integer getUserLiveVoteOpinion(Long voteInfoId, Long userId);

	CurrentVoteResponseDto putVoteOpinion(Long userId, Long battleBoardId, int voteInfoIndex);

	CurrentVoteResponseDto getVoteResult(Long battleBoardId);

	LiveCurrentVoteResponseDto getVoteLiveResult(Long battleBoardId, Long userId);

	RedisTopicCustomDto<List<VoteOpinionDtoWithVoteCount>> putLiveVote(Long battleBoardId, VoteRequest voteRequest);

	UserWinHistory getUserWinHistory(User user);

	CurrentVoteResponseDto getVoteResultByVoteInfoId(Long voteInfoId);
}
