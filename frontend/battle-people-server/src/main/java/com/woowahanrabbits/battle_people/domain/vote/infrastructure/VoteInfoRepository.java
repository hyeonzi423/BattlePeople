package com.woowahanrabbits.battle_people.domain.vote.infrastructure;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.woowahanrabbits.battle_people.domain.vote.domain.VoteInfo;

@Repository
public interface VoteInfoRepository extends JpaRepository<VoteInfo, Long> {

	Page<VoteInfo> findAllByCurrentStateOrderByStartDateDesc(int id, Pageable pageable);

	Page<VoteInfo> findAllByCurrentStateOrderByIdDesc(int status, Pageable pageable);

	Page<VoteInfo> findAllByCategoryAndCurrentStateOrderByIdDesc(Integer category, int status,
		Pageable pageable);

	List<VoteInfo> findAllByStartDateBeforeAndCurrentState(Date deadLineTimeCheck, int currentState);

	List<VoteInfo> findAllByEndDateBeforeAndCurrentState(Date date, int currentState);

}

