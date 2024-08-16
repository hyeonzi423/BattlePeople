package com.woowahanrabbits.battle_people.domain.user.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woowahanrabbits.battle_people.domain.interest.domain.Interest;

public interface InterestRepository extends JpaRepository<Interest, Long> {
	List<Interest> findAllByUserId(long userId);

	void deleteAllByUserId(long userId);
}
