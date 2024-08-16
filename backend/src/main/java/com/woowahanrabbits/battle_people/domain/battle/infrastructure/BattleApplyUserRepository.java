package com.woowahanrabbits.battle_people.domain.battle.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleApplyUser;
import com.woowahanrabbits.battle_people.domain.battle.domain.BattleApplyUserId;

@Repository
public interface BattleApplyUserRepository
	extends JpaRepository<BattleApplyUser, BattleApplyUserId> { // Composite key 적용

	@Query("SELECT COUNT(ba) FROM BattleApplyUser ba WHERE ba.battleBoard.id = :battleBoardId")
	int countByBattleBoardId(@Param("battleBoardId") Long battleBoardId);

	List<BattleApplyUser> findByBattleBoard_IdAndSelectedOpinion(Long battleBoardId, int selectedOpinion);

	boolean existsByBattleBoardIdAndUserId(Long id, long id1);

	@Query("SELECT COUNT(ba) FROM BattleApplyUser ba WHERE ba.battleBoard.id = :id "
		+ "AND ba.selectedOpinion = :voteOpinionIndex")
	int countByBattleBoardIdAndSelectedOpinion(Long id, Integer voteOpinionIndex);

	List<BattleApplyUser> findByBattleBoardId(Long id);
}
