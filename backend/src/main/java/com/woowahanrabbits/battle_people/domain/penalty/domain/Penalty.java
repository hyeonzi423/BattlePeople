package com.woowahanrabbits.battle_people.domain.penalty.domain;

import java.util.Date;

import com.woowahanrabbits.battle_people.domain.report.domain.Report;
import com.woowahanrabbits.battle_people.domain.user.domain.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.Data;

@Entity
@Data
public class Penalty {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "report_id")
	private Report report;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	private int penaltyCode;
	private Date registDate;

	@PrePersist
	protected void onCreate() {
		this.registDate = new Date();
	}
}
