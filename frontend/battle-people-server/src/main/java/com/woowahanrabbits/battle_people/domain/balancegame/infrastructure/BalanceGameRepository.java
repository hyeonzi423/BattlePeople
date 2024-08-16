package com.woowahanrabbits.battle_people.domain.balancegame.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.woowahanrabbits.battle_people.domain.balancegame.domain.BalanceGameBoardComment;
import com.woowahanrabbits.battle_people.domain.balancegame.dto.BalanceGameCommentResponse;

@Deprecated
public interface BalanceGameRepository extends JpaRepository<BalanceGameBoardComment, Long> {

	@Query(
		"SELECT new com.woowahanrabbits.battle_people.domain.balancegame.dto."
			+ "BalanceGameCommentResponse(b.id, b.battleBoard.id, b.user, b.content, b.registDate) "
			+ "FROM BalanceGameBoardComment b "
			+ "WHERE b.battleBoard.id = :battleBoardId")
	List<BalanceGameCommentResponse> findCommentsByBattleBoardId(@Param("battleBoardId") Long battleBoardId);

	List<BalanceGameBoardComment> findByBattleBoardId(Long id);
}
