package com.woowahanrabbits.battle_people.domain.live.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WriteTalkResponseDto {
	private int userVote;
	private Long requestUserId;
	private Long hostUserId;
	private String connectionId;
	private int idx;
	private String nickname;
	private int rating;
}
