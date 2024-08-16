package com.woowahanrabbits.battle_people.domain.user.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.dto.PrincipalDetails;
import com.woowahanrabbits.battle_people.domain.user.handler.JwtAuthenticationException;
import com.woowahanrabbits.battle_people.domain.user.jwt.JwtUtil;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Builder
@Service
public class PrincipalDetailsService implements UserDetailsService {

	private final JwtUtil jwtUtil;

	@Override
	public UserDetails loadUserByUsername(String access) throws UsernameNotFoundException {
		User userEntity;
		if (jwtUtil.validateToken(access, "access")) {
			String email = jwtUtil.extractUsername(access);
			String role = jwtUtil.extractUserRole(access);
			String nickname = jwtUtil.extractNickname(access);
			Long userId = jwtUtil.extractUserId(access);

			userEntity = new User(userId, email, nickname, role);
		} else {
			throw new JwtAuthenticationException("Invalid access token");
		}
		return new PrincipalDetails(userEntity);
	}
}
