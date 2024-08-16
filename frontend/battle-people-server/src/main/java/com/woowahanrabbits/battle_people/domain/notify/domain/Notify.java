package com.woowahanrabbits.battle_people.domain.notify.domain;

import java.util.Date;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.user.domain.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Notify {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "battle_board_id")
	private BattleBoard battleBoard;

	private int notifyCode;
	private String title;
	private Date registDate;
	@Setter
	private boolean isRead;

	@PrePersist
	protected void onCreate() {
		this.registDate = new Date();
	}
}
