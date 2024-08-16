package com.woowahanrabbits.battle_people.domain.user.service;

import com.woowahanrabbits.battle_people.domain.user.domain.User;

public interface SecurityService {
	User getAuthentication();
}
