package com.woowahanrabbits.battle_people.domain.live.service;

import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.woowahanrabbits.battle_people.domain.battle.domain.BattleBoard;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleBoardRepository;
import com.woowahanrabbits.battle_people.domain.live.domain.LiveApplyUser;
import com.woowahanrabbits.battle_people.domain.live.dto.OpenViduTokenResponseDto;
import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicDto;
import com.woowahanrabbits.battle_people.domain.live.infrastructure.LiveApplyUserRepository;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.infrastructure.UserRepository;
import com.woowahanrabbits.battle_people.domain.vote.domain.UserVoteOpinion;
import com.woowahanrabbits.battle_people.domain.vote.infrastructure.UserVoteOpinionRepository;

import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduException;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Recording;
import io.openvidu.java.client.RecordingProperties;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;

@SuppressWarnings("checkstyle:LineLength")
@Service
public class OpenViduServiceImpl implements OpenViduService {
	enum PublisherRole {
		SPEAKER, SUPPORTER
	}

	record ServerData(int index, PublisherRole role, Date tokenEndDate) {
	}

	public static record RedisBattleDto(long battleId, long registerUserId, long oppositeUserId, Date endDate) {
	}

	private final OpenVidu openVidu;
	private final LiveApplyUserRepository liveApplyUserRepository;
	private final BattleBoardRepository battleBoardRepository;
	private final UserVoteOpinionRepository userVoteOpinionRepository;
	private final UserRepository userRepository;
	private static final Logger logger = LoggerFactory.getLogger(OpenViduServiceImpl.class);
	private final ObjectMapper mapper;
	private final RedisTemplate<String, Object> redisTemplate;
	private final RestTemplate restTemplate;

	@Value("${openvidu.url}")
	private String openviduUrl;

	@Value("${openvidu.secret}")
	private String openviduSecret;

	public OpenViduServiceImpl(@Value("${openvidu.url}") String openviduUrl,
		@Value("${openvidu.secret}") String secret,
		LiveApplyUserRepository liveApplyUserRepository,
		BattleBoardRepository battleBoardRepository, UserVoteOpinionRepository userVoteOpinionRepository,

		UserRepository userRepository,
		ObjectMapper mapper, RedisTemplate<String, Object> redisTemplate, RestTemplate restTemplate) {

		this.userVoteOpinionRepository = userVoteOpinionRepository;
		this.userRepository = userRepository;
		this.redisTemplate = redisTemplate;
		this.restTemplate = restTemplate;
		this.openVidu = new OpenVidu(openviduUrl, secret);
		this.liveApplyUserRepository = liveApplyUserRepository;
		this.battleBoardRepository = battleBoardRepository;
		this.mapper = mapper;
	}

	@Override
	public Session createSession(BattleBoard battleBoard) {
		RecordingProperties recordingProperties = new RecordingProperties.Builder()
			.outputMode(Recording.OutputMode.INDIVIDUAL) // 개별 스트림 녹화 모드
			.hasVideo(false)
			.build();
		SessionProperties properties = new SessionProperties.Builder()
			.customSessionId(battleBoard.getId().toString())
			.defaultRecordingProperties(recordingProperties)
			.build();

		Session session = null;
		try {
			session = openVidu.createSession(properties);
		} catch (OpenViduException e) {
			throw new RuntimeException(e);
		}

		Date endDate = battleBoard.getVoteInfo().getEndDate();
		long diffInMillis = endDate.getTime() - System.currentTimeMillis();
		long diffInSeconds = TimeUnit.MILLISECONDS.toSeconds(diffInMillis);

		return session;
	}

	private int getUserCurrentRole(BattleBoard battleBoard, User user) {

		LiveApplyUser applyUser = liveApplyUserRepository.findByBattleBoardIdAndParticipantId(battleBoard.getId(),
			user.getId());

		if (applyUser == null) {
			if (battleBoard.getRegistUser().getId() == user.getId()) {
				return 0;
			}
			if (battleBoard.getOppositeUser().getId() == user.getId()) {
				return 1;
			}
			return -1;
		}

		if (applyUser.getRole().equals("viewer")) {
			return -1;
		}

		if (battleBoard.getRegistUser().getId() == user.getId()) {
			return 0;
		}
		if (battleBoard.getOppositeUser().getId() == user.getId()) {
			return 1;
		}
		UserVoteOpinion userVoteOpinion = userVoteOpinionRepository.findByUserIdAndVoteInfoId(user.getId(),
			battleBoard.getVoteInfo().getId());
		if (userVoteOpinion != null) {
			return userVoteOpinion.getVoteInfoIndex();
		}
		return -2;
	}

	private void saveApplyUserRole(BattleBoard battleBoard, User user, String token, OpenViduRole role) {
		LiveApplyUser liveApplyUser = liveApplyUserRepository.findByBattleBoardIdAndParticipantId(battleBoard.getId(),
			user.getId());

		if (liveApplyUser != null) {
			return;
		}

		liveApplyUserRepository.save(LiveApplyUser.builder()
			.battleBoardId(battleBoard.getId())
			.participant(user) // 영속성 컨텍스트 내에서 관리되는 user 객체
			.role(role == OpenViduRole.PUBLISHER ? "broadcaster" : "viewer")
			.build());
	}

	@Override
	public OpenViduTokenResponseDto getToken(Long battleId, User user) {
		BattleBoard battleBoard = battleBoardRepository.findById(battleId).orElseThrow(NoSuchElementException::new);

		Session session = createSession(battleBoard);

		OpenViduRole role = OpenViduRole.SUBSCRIBER;
		int index = getUserCurrentRole(battleBoard, user);
		Date tokenEndDate = new Date();

		if (index == -2) {
			return null;
		}

		if (index == 0 || index == 1) {
			role = OpenViduRole.PUBLISHER;
		}

		ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
			.type(ConnectionType.WEBRTC)
			.data(getServerData(index, getUserTokenEndedDate(battleBoard, user.getId(), role)))
			.role(role)

			.build();

		String token;
		try {
			token = session.createConnection(connectionProperties).getToken();
		} catch (OpenViduException exception) {
			throw new RuntimeException("Failed to create token", exception);
		}

		saveApplyUserRole(battleBoard, user, token, role);

		logger.info("[User Token] :" + token + ", userid: " + user.getId());
		return new OpenViduTokenResponseDto(user.getId(), token, index);
	}

	@Override
	public RedisTopicDto<OpenViduTokenResponseDto> changeRole(Long battleId, Long userId, String connectionId) {
		if (!isValidConnection(Long.toString(battleId), connectionId)) {
			RedisTopicDto redisTopicDto = RedisTopicDto.builder()
				.channelId(battleId)
				.type("accept")
				.responseDto(new OpenViduTokenResponseDto(userId, null, -2))
				.build();

			return redisTopicDto;
		}

		User user = userRepository.findById(userId).orElse(null);
		if (user == null) {
			return new RedisTopicDto<>("accept", battleId, new OpenViduTokenResponseDto(userId, null, -2));
		}

		LiveApplyUser applyUser = liveApplyUserRepository.findByBattleBoardIdAndParticipantId(battleId, user.getId());

		if (applyUser == null) {
			return new RedisTopicDto<>("accept", battleId, new OpenViduTokenResponseDto(userId, null, -2));
		}

		applyUser.setRole(applyUser.getRole().equals("broadcaster") ? "viewer" : "broadcaster");
		liveApplyUserRepository.save(applyUser);
		BattleBoard battleBoard = battleBoardRepository.findById(battleId).orElseThrow(NoSuchElementException::new);

		if (applyUser.getRole().equals("broadcaster")) {
			String data = getServerData(
				getUserCurrentRole(battleBoard,
					user), getUserTokenEndedDate(battleBoard, userId,
					applyUser.getRole().equals("broadcaster") ? OpenViduRole.PUBLISHER : OpenViduRole.SUBSCRIBER));

		}

		RedisTopicDto redisTopicDto = RedisTopicDto.builder()
			.channelId(battleId)
			.type("accept")
			.responseDto(getToken(battleId, user))
			.build();

		return redisTopicDto;
	}

	private HttpHeaders createHeaders(String username, String password) {
		return new HttpHeaders() {
			{
				String auth = username + ":" + password;
				byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes());
				String authHeader = "Basic " + new String(encodedAuth);
				set("Authorization", authHeader);
			}
		};
	}

	private boolean isValidConnection(String sessionId, String connectionId) {
		String url = openviduUrl + "/" + sessionId + "/connection/" + connectionId;

		HttpHeaders headers = createHeaders("OPENVIDUAPP", openviduSecret);
		HttpEntity<String> entity = new HttpEntity<>(headers);

		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode root = objectMapper.readTree(response.getBody());
			if (root.path("status").asText().equals("active")) {
				return true;
			}
		} catch (Exception e) {
			return false;
		}
		return false;
	}

	private String getServerData(int index, Date date) {
		String data = null;
		if (index >= 0) {
			try {
				data = mapper.writeValueAsString(new ServerData(index, PublisherRole.SPEAKER, date));
			} catch (JsonProcessingException ignored) {
			}
		}
		return data;
	}

	private Date getUserTokenEndedDate(BattleBoard battleBoard, Long userId, OpenViduRole role) {
		long register = battleBoard.getRegistUser().getId();
		long opposite = battleBoard.getOppositeUser().getId();

		if ((role == OpenViduRole.PUBLISHER && (register == userId || opposite == userId))
			|| (role == OpenViduRole.SUBSCRIBER && (register != userId || opposite != userId))) {
			return battleBoard.getVoteInfo().getEndDate();
		}

		Date date = new Date(); // 현재 날짜와 시간

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MINUTE, 1);

		return calendar.getTime();
	}

	@Override
	public void userLeft(Long battleId, Long userId) {
		LiveApplyUser liveApplyUser = liveApplyUserRepository.findByBattleBoardIdAndParticipantId(battleId, userId);
		if (liveApplyUser == null) {
			throw new RuntimeException("User not found in room");
		}

		liveApplyUser.setOutTime(new Date());
		liveApplyUserRepository.save(liveApplyUser);
	}
}
