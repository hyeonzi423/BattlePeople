package com.woowahanrabbits.battle_people.domain.battle.dto;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.user.dto.BasicUserDto;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteOpinion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BattleResponse {
	private Long battleId;
	private String title;
	private int category;
	private BasicUserDto registUser;
	private String opinion;
	private Date startDate;
	private int minute;
	private int maxPeopleCount;

	public BattleResponse(BattleBoard battleBoard, VoteOpinion voteOpinion) {
		this.battleId = battleBoard.getId();
		this.title = battleBoard.getVoteInfo().getTitle();
		this.category = battleBoard.getVoteInfo().getCategory();
		this.registUser = new BasicUserDto(battleBoard.getRegistUser());
		this.opinion = voteOpinion.getOpinion();
		this.startDate = battleBoard.getVoteInfo().getStartDate();
		this.minute = calculateMinute(battleBoard.getVoteInfo().getStartDate(), battleBoard.getVoteInfo().getEndDate());
		this.maxPeopleCount = battleBoard.getMaxPeopleCount();
	}

	private int calculateMinute(Date startDate, Date endDate) {
		long diffInMillis = endDate.getTime() - startDate.getTime(); // 밀리초 차이 계산
		return (int)TimeUnit.MILLISECONDS.toMinutes(diffInMillis);  // 분 단위로 변환
	}
}
