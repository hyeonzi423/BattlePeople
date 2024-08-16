package com.woowahanrabbits.battle_people.domain.user.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {

	public User(long id, String email, String nickname, String role) {
		this.id = id;
		this.email = email;
		this.nickname = nickname;
		this.role = role;
	}

	public User(String email, String password, String nickname, String imgUrl, String role) {
		this.email = email;
		this.password = password;
		this.nickname = nickname;
		this.imgUrl = imgUrl;
		this.role = role;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String nickname;

	private String imgUrl;

	private int rating;
	private LocalDate penaltyStartDate;

	private LocalDate penaltyEndDate;

	private String role; // ROLE_USER, ROLE_ADMIN

}
