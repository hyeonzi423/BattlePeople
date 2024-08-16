package com.woowahanrabbits.battle_people.domain.battle.domain;

import java.util.Date;

import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class BattleBoard {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "regist_user_id", nullable = false)
	private User registUser;

	@ManyToOne
	@JoinColumn(name = "opposite_user_id")
	private User oppositeUser;

	@OneToOne
	@JoinColumn(name = "vote_info_id")
	private VoteInfo voteInfo;

	private int minPeopleCount;
	private int maxPeopleCount;
	private String battleRule;
	private Date registDate;
	private String rejectionReason;
	private String imageUrl;
	private String liveUri;
	private boolean isDeleted;

	@PrePersist
	protected void onCreate() {
		this.registDate = new Date();
	}
}
