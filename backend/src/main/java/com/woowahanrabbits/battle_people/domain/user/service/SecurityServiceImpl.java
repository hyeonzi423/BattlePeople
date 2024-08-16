package com.woowahanrabbits.battle_people.domain.user.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.dto.PrincipalDetails;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SecurityServiceImpl implements SecurityService {

	@Override
	public User getAuthentication() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof PrincipalDetails) {
			User user = ((PrincipalDetails)authentication.getPrincipal()).getUser();
			log.debug("Authenticated user: {}", user);
			return user;
		}
		return null;
	}
}
