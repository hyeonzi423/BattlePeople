package com.woowahanrabbits.battle_people.domain.user.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.interest.domain.Interest;
import com.woowahanrabbits.battle_people.domain.notify.dto.NotificationType;
import com.woowahanrabbits.battle_people.domain.notify.service.NotifyService;
import com.woowahanrabbits.battle_people.domain.user.domain.Rating;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.dto.BasicUserDto;
import com.woowahanrabbits.battle_people.domain.user.dto.InterestRequest;
import com.woowahanrabbits.battle_people.domain.user.dto.JoinRequest;
import com.woowahanrabbits.battle_people.domain.user.dto.LoginRequest;
import com.woowahanrabbits.battle_people.domain.user.handler.UserException;
import com.woowahanrabbits.battle_people.domain.user.infrastructure.InterestRepository;
import com.woowahanrabbits.battle_people.domain.user.infrastructure.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	@Value("${storage.location}")
	private String uploadDir;

	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final UserRepository userRepository;
	private final NotifyService notifyService;
	private final InterestRepository interestRepository;

	public User login(LoginRequest loginRequest) {
		Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

		User user = userOptional.orElseThrow(() -> new UserException("Invalid email or password"));

		if (!bCryptPasswordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
			throw new UserException("Wrong password");
		}

		return user;
	}

	public User join(JoinRequest joinRequest) {
		String email = joinRequest.getEmail();
		String password = bCryptPasswordEncoder.encode(joinRequest.getPassword());
		String nickname = joinRequest.getNickname();

		if (userRepository.existsByEmail(email)) {
			throw new UserException("Email already in use");
		}

		if (userRepository.existsByNickname(nickname)) {
			throw new UserException("Nickname already in use");
		}

		User user = new User(email, password, nickname, uploadDir + "/default.png", "ROLE_USER");

		userRepository.save(user);

		return user;
	}

	public List<User> findAllUsers() {
		List<User> list = userRepository.findAll();
		if (list.isEmpty()) {
			throw new UserException("No users found");
		}
		return list;
	}

	public List<Integer> getInterest(long id) {
		List<Interest> list = interestRepository.findAllByUserId(id);
		List<Integer> response = new ArrayList<>();
		for (Interest interest : list) {
			response.add(interest.getCategory());
		}
		Collections.sort(response);
		return response;
	}

	@Transactional
	public void setInterest(long userId, InterestRequest request) {
		interestRepository.deleteAllByUserId(userId);
		List<Interest> interests = request.getCategory().stream()
			.map(category -> new Interest(userId, category, 1))
			.collect(Collectors.toList());

		interestRepository.saveAll(interests);
	}

	public User getUserProfile(long id) {
		Optional<User> user = userRepository.findById(id);
		if (user.isEmpty()) {
			throw new UserException("User not found");
		}
		return user.get();
	}

	public boolean isNicknameAvailable(String nickname) {
		return !userRepository.existsByNickname(nickname);
	}

	public boolean isEmailAvailable(String email) {
		return !userRepository.existsByEmail(email);
	}

	public List<User> findByNickname(String nickname) {
		return userRepository.findByNicknameContaining(nickname);
	}

	public User updateUserImgUrl(long userId, String imgUrl) {
		User user = userRepository.findById(userId).orElseThrow(() -> new UserException("User not found"));
		user.setImgUrl(uploadDir + "/" + imgUrl);
		return userRepository.save(user);
	}

	public void updateUser(BasicUserDto userDto) {
		User user = userRepository.findById(userDto.getId()).orElseThrow(() -> new UserException("User not found"));
		user.setNickname(userDto.getNickname());
		user.setImgUrl(userDto.getImgUrl());
		userRepository.save(user);
	}

	//point
	public void addPoint(User user, BattleBoard battleBoard, Rating rating) {
		int rate = user.getRating();
		rate += rating.getPoint();
		user.setRating(rate);
		userRepository.save(user);
		notifyService.sendPointNotification(user, battleBoard, NotificationType.ADD_POINT, rating);
	}
}
