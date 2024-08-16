package com.woowahanrabbits.battle_people.domain.user.dto;

import java.util.Date;

import com.woowahanrabbits.battle_people.domain.user.domain.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
	private Long id;
	private String email;
	private String nickname;
	private String imgUrl;
	private Integer rating;
	private Date accessExpiration;

	public LoginResponse(User user, Date accessExpiration) {
		this.id = user.getId();
		this.email = user.getEmail();
		this.nickname = user.getNickname();
		this.imgUrl = user.getImgUrl();
		this.rating = user.getRating();
		this.accessExpiration = accessExpiration;
	}
}
