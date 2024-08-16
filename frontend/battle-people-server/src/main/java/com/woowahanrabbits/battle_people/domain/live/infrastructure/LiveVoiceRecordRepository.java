package com.woowahanrabbits.battle_people.domain.live.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woowahanrabbits.battle_people.domain.live.domain.LiveVoiceRecord;

public interface LiveVoiceRecordRepository extends JpaRepository<LiveVoiceRecord, Long> {
}
