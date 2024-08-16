package com.woowahanrabbits.battle_people.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.woowahanrabbits.battle_people.domain.live.service.RedisSubscriber;

@Configuration
public class RedisConfig {

	@Bean
	public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory
	) {
		RedisTemplate<String, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(redisConnectionFactory);
		template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
		template.setKeySerializer(new StringRedisSerializer());
		template.setHashKeySerializer(new StringRedisSerializer());
		template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
		template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
		return template;
	}

	@Bean
	public RedisMessageListenerContainer container(RedisConnectionFactory redisConnectionFactory,
		MessageListenerAdapter messageListener) {
		RedisMessageListenerContainer container = new RedisMessageListenerContainer();
		container.setConnectionFactory(redisConnectionFactory);
		container.addMessageListener(messageListener, new ChannelTopic("chat"));
		container.addMessageListener(messageListener, new ChannelTopic("live"));
		container.addMessageListener(messageListener, new ChannelTopic("request"));
		container.addMessageListener(messageListener, new ChannelTopic("notify"));
		container.addMessageListener(messageListener, new ChannelTopic("notify-list"));
		return container;
	}

	@Bean
	public MessageListenerAdapter messageListener(RedisSubscriber redisSubscriber) {
		return new MessageListenerAdapter(redisSubscriber);
	}

}
