package com.woowahanrabbits.battle_people.domain.live.domain;

import java.util.Date;

import com.woowahanrabbits.battle_people.domain.user.domain.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
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
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@IdClass(LiveApplyUserId.class)
public class LiveApplyUser {

	@Id
	@Column(name = "battle_board_id", insertable = false, updatable = false)
	private Long battleBoardId;

	@Id
	@Column(name = "participant_id", insertable = false, updatable = false)
	private Long participantId;

	@ManyToOne
	@JoinColumn(name = "participant_id", nullable = false)
	@MapsId("participantId")
	private User participant;

	@Column(nullable = false)
	private Date inTime;

	private Date outTime;

	private String role;

	@PrePersist
	protected void onCreate() {
		this.inTime = new Date();
	}
}
