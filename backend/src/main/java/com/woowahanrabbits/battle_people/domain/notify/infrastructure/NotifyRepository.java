package com.woowahanrabbits.battle_people.domain.notify.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woowahanrabbits.battle_people.domain.notify.domain.Notify;

public interface NotifyRepository extends JpaRepository<Notify, Long> {
	List<Notify> findAllByUserIdAndIsReadFalse(Long userId);

	List<Notify> findAllByUserIdAndIsReadFalseOrderByIsReadAscRegistDateDesc(Long userId);

	List<Notify> findAllByUserIdOrderByIsReadAscRegistDateDesc(Long userId);

	boolean existsByBattleBoardIdAndNotifyCode(Long battleId, int notifyCode);
}
