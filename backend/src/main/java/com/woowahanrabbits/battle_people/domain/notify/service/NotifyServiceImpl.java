package com.woowahanrabbits.battle_people.domain.notify.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.notify.domain.Notify;
import com.woowahanrabbits.battle_people.domain.notify.dto.NotificationResponseDto;
import com.woowahanrabbits.battle_people.domain.notify.dto.NotificationType;
import com.woowahanrabbits.battle_people.domain.notify.infrastructure.NotifyRepository;
import com.woowahanrabbits.battle_people.domain.user.domain.Rating;
import com.woowahanrabbits.battle_people.domain.user.domain.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotifyServiceImpl implements NotifyService {

	private final NotifyRepository notifyRepository;
	private final RedisTemplate<String, Object> redisTemplate;

	public void sendPointNotification(User user, BattleBoard battleBoard, NotificationType type, Rating rating) {
		String title = NotificationType.ADD_POINT.formatMessage(battleBoard.getVoteInfo(), rating);
		Notify notify = new Notify();
		notify.setTitle(title);
		notify.setUser(user);
		notify.setBattleBoard(battleBoard);
		notify.setNotifyCode(type.getCode());
		notify.setRegistDate(new Date());
		notify.setRead(false);
		notifyRepository.save(notify);
		Map<String, String> map = new HashMap<>();
		map.put("title", title);
		map.put("id", Long.toString(user.getId()));
		redisTemplate.convertAndSend("notify", map);
	}

	public void sendNotification(User user, BattleBoard battleBoard, NotificationType type) {
		String title = String.format(type.getMessageTemplate(),
			switch (type.getCode()) {
				case 0 -> battleBoard.getRegistUser().getNickname();
				case 1 -> battleBoard.getVoteInfo().getTitle();
				case 2 -> battleBoard.getOppositeUser().getNickname();
				case 3 -> battleBoard.getOppositeUser().getNickname();
				default -> throw new RuntimeException("Invalid notification type");
			}
		);

		Notify notify = new Notify();
		notify.setNotifyCode(type.getCode());
		notify.setTitle(title); // 완성된 제목을 설정
		notify.setUser(user);
		notify.setRegistDate(new Date());
		notify.setBattleBoard(battleBoard);
		notify.setRead(false);

		if (notify.getNotifyCode() == 1) {
			System.out.println(title);
		}

		notifyRepository.save(notify);
		Map<String, String> map = new HashMap<>();
		map.put("title", title);
		map.put("id", Long.toString(user.getId()));

		redisTemplate.convertAndSend("notify", map);
	}

	@Override
	public List<NotificationResponseDto> getNotifications(Long userId) {
		List<Notify> list = notifyRepository.findAllByUserIdOrderByIsReadAscRegistDateDesc(userId);
		List<NotificationResponseDto> returnList = new ArrayList<>();
		System.out.println(list.size());
		for (Notify notify : list) {
			NotificationResponseDto notificationResponseDto = new NotificationResponseDto(notify);
			returnList.add(notificationResponseDto);
		}
		return returnList;
	}

	@Override
	public boolean hasUnreadNotifications(Long userId) {
		int size = notifyRepository.findAllByUserIdAndIsReadFalse(userId).size();
		return size > 0 ? true : false;
	}

	@Override
	public void deleteNotification(Long notifyId) {
		notifyRepository.deleteById(notifyId);
	}

	@Override
	public List<NotificationResponseDto> updateReadState(Long notifyId) {
		Notify notify = notifyRepository.findById(notifyId).orElse(null);
		if (notify == null) {
			return new ArrayList<>();
		}

		notify.setRead(true);
		notifyRepository.save(notify);

		List<Notify> userNotifies = notifyRepository.findAllByUserIdOrderByIsReadAscRegistDateDesc(
			notify.getUser().getId());
		List<NotificationResponseDto> returnList = new ArrayList<>();
		for (Notify userNotify : userNotifies) {
			NotificationResponseDto notificationResponseDto = new NotificationResponseDto(userNotify);
			returnList.add(notificationResponseDto);
		}
		return returnList;

	}
}
