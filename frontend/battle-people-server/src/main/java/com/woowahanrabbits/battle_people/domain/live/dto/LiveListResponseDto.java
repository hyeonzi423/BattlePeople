package com.woowahanrabbits.battle_people.domain.live.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LiveListResponseDto {
	private Long id;

	private String title;

	private BroadcastUser registerUser;
	private BroadcastUser oppositeUser;

	private Date startDate;
	private Date endDate;
	private int currentPeopleCount;

	private int category;
	private String imageUri;
	private String battleRule;
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

}
