package com.woowahanrabbits.battle_people.domain.live.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woowahanrabbits.battle_people.domain.live.domain.LiveApplyUser;
import com.woowahanrabbits.battle_people.domain.live.domain.LiveApplyUserId;

public interface LiveApplyUserRepository extends JpaRepository<LiveApplyUser, LiveApplyUserId> {

	List<LiveApplyUser> findAllByBattleBoardId(Long id);

	LiveApplyUser findByBattleBoardIdAndParticipantId(Long battleBoardId, Long participantId);

	int countByBattleBoardId(Long battleBoardId);
}
