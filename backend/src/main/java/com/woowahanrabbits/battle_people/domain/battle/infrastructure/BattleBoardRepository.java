package com.woowahanrabbits.battle_people.domain.battle.infrastructure;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;

public interface BattleBoardRepository extends JpaRepository<BattleBoard, Long> {

	@Query(
		"SELECT bb FROM BattleBoard bb JOIN FETCH bb.voteInfo vi "
			+ "LEFT JOIN FETCH bb.registUser ru LEFT JOIN FETCH bb.oppositeUser ou "
			+ "WHERE :currentTime BETWEEN vi.startDate AND vi.endDate "
			+ "AND vi.title LIKE %:keyword% "
			+ "AND vi.category = :category "
			+ "AND vi.currentState = 4 "
			+ "ORDER BY vi.startDate DESC, bb.id ASC")
	Page<BattleBoard> findAllActiveBattleBoardsByCategory(
		@Param("currentTime") Date currentTime,
		@Param("keyword") String keyword,
		@Param("category") int category,
		Pageable pageable
	);

	@Query(
		"SELECT bb FROM BattleBoard bb JOIN FETCH bb.voteInfo vi "
			+ "LEFT JOIN FETCH bb.registUser ru LEFT JOIN FETCH bb.oppositeUser ou "
			+ "WHERE :currentTime BETWEEN vi.startDate AND vi.endDate "
			+ "AND vi.title LIKE %:keyword% "
			+ "AND vi.currentState = 4 "
			+ "ORDER BY vi.startDate DESC, bb.id ASC")
	Page<BattleBoard> findAllActiveBattleBoards(
		@Param("currentTime") Date currentTime,
		@Param("keyword") String keyword,
		Pageable pageable
	);

	@Query("SELECT bb FROM BattleBoard bb JOIN FETCH bb.voteInfo vi "
		+ "LEFT JOIN FETCH bb.registUser ru LEFT JOIN FETCH bb.oppositeUser ou "
		+ "WHERE vi.startDate > :currentTime "
		+ "AND vi.title LIKE %:keyword% "
		+ "AND vi.category = :category "
		+ "AND vi.currentState = 3 "
		+ "ORDER BY vi.startDate ASC, bb.id ASC")
	Page<BattleBoard> findAllWaitBattleBoardsByCategory(
		@Param("currentTime") Date currentTime,
		@Param("keyword") String keyword,
		@Param("category") int category,
		Pageable pageable
	);

	@Query("SELECT bb FROM BattleBoard bb JOIN FETCH bb.voteInfo vi "
		+ "LEFT JOIN FETCH bb.registUser ru LEFT JOIN FETCH bb.oppositeUser ou "
		+ "WHERE vi.startDate > :currentTime "
		+ "AND vi.title LIKE %:keyword% "
		+ "AND vi.currentState = 3 "
		+ "ORDER BY vi.startDate ASC, bb.id ASC")
	Page<BattleBoard> findAllWaitBattleBoards(
		@Param("currentTime") Date currentTime,
		@Param("keyword") String keyword,
		Pageable pageable
	);

	@Query("SELECT bb FROM BattleBoard bb JOIN FETCH bb.voteInfo vi "
		+ "LEFT JOIN FETCH bb.registUser ru LEFT JOIN FETCH bb.oppositeUser ou "
		+ "WHERE :currentTime > vi.endDate "
		+ "AND vi.title LIKE %:keyword% "
		+ "AND vi.category = :category "
		+ "AND vi.currentState = 8 "
		+ "ORDER BY vi.startDate DESC, bb.id ASC")
	Page<BattleBoard> findAllEndBattleBoardsByCategory(
		@Param("currentTime") Date currentTime,
		@Param("keyword") String keyword,
		@Param("category") int category,
		Pageable pageable
	);

	@Query("SELECT bb FROM BattleBoard bb JOIN FETCH bb.voteInfo vi "
		+ "LEFT JOIN FETCH bb.registUser ru LEFT JOIN FETCH bb.oppositeUser ou "
		+ "WHERE :currentTime > vi.endDate "
		+ "AND vi.title LIKE %:keyword% "
		+ "AND vi.currentState = 8 "
		+ "ORDER BY vi.startDate DESC, bb.id ASC")
	Page<BattleBoard> findAllEndBattleBoards(
		@Param("currentTime") Date currentTime,
		@Param("keyword") String keyword,
		Pageable pageable
	);

	@Query("SELECT b FROM BattleBoard b WHERE b.voteInfo.startDate "
		+ "BETWEEN :startDate AND :endDate AND "
		+ "(SELECT COUNT(ba) FROM BattleApplyUser ba WHERE ba.battleBoard = b) >= 5")
	List<BattleBoard> findEligibleBattleBoards(@Param("startDate") LocalDateTime startDate,
		@Param("endDate") LocalDateTime endDate);

	@Query("SELECT b FROM BattleBoard b WHERE b.voteInfo.endDate "
		+ "BETWEEN :startDate AND :endDate AND "
		+ "(SELECT COUNT(ba) FROM BattleApplyUser ba WHERE ba.battleBoard = b) >= 5")
	List<BattleBoard> findBattleBoardsByEndDate(@Param("startDate") LocalDateTime startDate,
		@Param("endDate") LocalDateTime endDate);

}

