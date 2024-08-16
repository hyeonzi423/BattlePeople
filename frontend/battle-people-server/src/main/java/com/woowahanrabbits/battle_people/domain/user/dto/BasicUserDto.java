package com.woowahanrabbits.battle_people.domain.user.dto;

import com.woowahanrabbits.battle_people.domain.user.domain.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BasicUserDto {
	private Long id;
	private String email;
	private String nickname;
	private String imgUrl;
	private Integer rating;

	public BasicUserDto(User user) {
		this.id = user.getId();
		this.email = user.getEmail();
		this.nickname = user.getNickname();
		this.imgUrl = user.getImgUrl();
		this.rating = user.getRating();
	}
}
