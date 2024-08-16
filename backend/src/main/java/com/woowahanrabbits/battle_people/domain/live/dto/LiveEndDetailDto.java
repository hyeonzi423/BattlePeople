package com.woowahanrabbits.battle_people.domain.live.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LiveEndDetailDto {
	private Long id;

	private String title;

	private BroadcastUser registerUser;
	private BroadcastUser oppositeUser;

	private VoteResult preResult;
	private VoteResult preResultCount;
	private VoteResult finalResult;
	private VoteResult finalResultCount;

	private int category;
	private String imageUri;
	private String summary;

	@Data
	@AllArgsConstructor
	public static class BroadcastUser {
		long id;
		String nickname;
		String imgUrl;
		int rating;
		String opinion;
	}

	@Data
	@AllArgsConstructor
	public static class VoteResult {
		int percentageRegisterOpinion;
		int percentageOppositeOpinion;
	}
}
