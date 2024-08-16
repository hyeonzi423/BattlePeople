package com.woowahanrabbits.battle_people.domain.live.service;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.woowahanrabbits.battle_people.domain.live.dto.ItemRequestDto;
import com.woowahanrabbits.battle_people.domain.live.dto.OpenViduTokenResponseDto;
import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicCustomDto;
import com.woowahanrabbits.battle_people.domain.live.dto.RedisTopicDto;
import com.woowahanrabbits.battle_people.domain.live.dto.response.WriteChatResponseDto;
import com.woowahanrabbits.battle_people.domain.live.dto.response.WriteTalkResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {
	private final ObjectMapper objectMapper;
	private final SimpMessagingTemplate messagingTemplate;

	@Override
	public void onMessage(Message message, byte[] pattern) {
		try {
			String channel = new String(message.getChannel(), StandardCharsets.UTF_8);
			String publishMessage = new String(message.getBody(), StandardCharsets.UTF_8);

			if (channel.equals("notify")) {
				Map<String, String> map = objectMapper.readValue(publishMessage, Map.class);
				messagingTemplate.convertAndSend("/topic/" + map.get("id"), map.get("title"));

			}
			if (channel.equals("notify-list")) {
				RedisTopicDto<?> redisTopicDto = objectMapper.readValue(publishMessage, RedisTopicDto.class);
				Long channelId = redisTopicDto.getChannelId();

				if (redisTopicDto.getType().equals("read")) {
					RedisTopicDto<List<?>> responseTopicDto = objectMapper.readValue(publishMessage,
						new TypeReference<>() {
						});

					messagingTemplate.convertAndSend("/topic/notify/" + channelId,
						new RedisTopicDto<>("read", channelId, responseTopicDto.getResponseDto().get(1)));
				}

			} else {
				RedisTopicDto<?> redisTopicDto = objectMapper.readValue(publishMessage, RedisTopicDto.class);
				Long channelId = redisTopicDto.getChannelId();

				if (channel.equals("chat")) {
					RedisTopicDto<WriteChatResponseDto> chatTopicDto = objectMapper.readValue(publishMessage,
						new TypeReference<>() {
						});
					WriteChatResponseDto returnValue = chatTopicDto.getResponseDto();
					messagingTemplate.convertAndSend("/topic/chat/" + channelId, returnValue);

				} else if (channel.equals("request")) {
					LinkedHashMap<?, ?> map = (LinkedHashMap<?, ?>)redisTopicDto.getResponseDto();
					OpenViduTokenResponseDto dto = objectMapper.convertValue(map, OpenViduTokenResponseDto.class);
					messagingTemplate.convertAndSend("/topic/request/" + channelId + "-" + dto.getUserId(), dto);

				} else if (channel.equals("live")) {
					if (redisTopicDto.getType().equals("item")) {
						LinkedHashMap<?, ?> map = (LinkedHashMap<?, ?>)redisTopicDto.getResponseDto();
						ItemRequestDto dto = objectMapper.convertValue(map, ItemRequestDto.class);
						messagingTemplate.convertAndSend("/topic/live/" + channelId,
							new RedisTopicDto<>("item", channelId, dto));
					}
					if (redisTopicDto.getType().equals("speak")) {
						LinkedHashMap<?, ?> map = (LinkedHashMap<?, ?>)redisTopicDto.getResponseDto();
						WriteTalkResponseDto returnValue = objectMapper.convertValue(map, WriteTalkResponseDto.class);
						messagingTemplate.convertAndSend(
							"/topic/live/" + channelId, new RedisTopicDto<>("speak", channelId, returnValue));

					}
					if (redisTopicDto.getType().equals("vote")) {
						RedisTopicCustomDto<List<?>> responseTopicDto = objectMapper.readValue(publishMessage,
							new TypeReference<>() {
							});

						messagingTemplate.convertAndSend("/topic/live/" + channelId,
							new RedisTopicCustomDto<>("vote", channelId, responseTopicDto.getResponseDto().get(1),
								responseTopicDto.getUserVoteOpinion()));
					}
				}
			}

		} catch (Exception e) {
			log.error("Error processing message", e);
		}
	}
}
