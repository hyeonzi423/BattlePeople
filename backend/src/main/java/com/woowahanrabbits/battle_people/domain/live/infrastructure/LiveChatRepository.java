package com.woowahanrabbits.battle_people.domain.live.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.woowahanrabbits.battle_people.domain.live.domain.LiveChat;

@Repository
public interface LiveChatRepository extends JpaRepository<LiveChat, Long> {
}
