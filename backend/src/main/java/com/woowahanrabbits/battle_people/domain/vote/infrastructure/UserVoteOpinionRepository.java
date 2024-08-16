package com.woowahanrabbits.battle_people.domain.vote.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.woowahanrabbits.battle_people.domain.vote.domain.UserVoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.domain.UserVoteOpinionId;

@Repository
public interface UserVoteOpinionRepository extends JpaRepository<UserVoteOpinion, UserVoteOpinionId> {
	List<UserVoteOpinion> findByUserId(long id);

	List<UserVoteOpinion> findByVoteInfoIdAndVoteInfoIndex(Long id, int voteOpinionIndex);

	UserVoteOpinion findByUserIdAndVoteInfoId(long id, Long voteInfoId);

	UserVoteOpinion findByUser_IdAndVoteInfo_Id(Long userId, Long id);

	@Transactional
	void deleteByVoteInfoId(Long voteInfoId);

	@Query("SELECT COUNT(uvo) FROM UserVoteOpinion uvo WHERE uvo.voteInfo.id = :id "
		+ "AND uvo.voteInfoIndex = :voteOpinionIndex")
	int countByVoteInfoIdAndVoteInfoIndex(Long id, Integer voteOpinionIndex);

	@Query("SELECT uvo FROM UserVoteOpinion uvo JOIN FETCH uvo.voteInfo vi "
		+ "WHERE uvo.user.id = :userId "
		+ "AND (vi.currentState = 6 OR vi.currentState = 8)")
	List<UserVoteOpinion> findWinRateByUserId(Long userId);

}
