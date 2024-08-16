package com.woowahanrabbits.battle_people.domain.vote.domain;

import com.woowahanrabbits.battle_people.domain.user.domain.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@IdClass(VoteOpinionId.class)
public class VoteOpinion {

	@Id
	private Integer voteOpinionIndex;

	@Id
	private Long voteInfoId;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	private String opinion;
	private Integer preCount;
	@Setter
	private Integer finalCount;

}
