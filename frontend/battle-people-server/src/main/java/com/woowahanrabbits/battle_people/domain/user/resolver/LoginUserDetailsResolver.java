package com.woowahanrabbits.battle_people.domain.user.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.service.SecurityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoginUserDetailsResolver implements HandlerMethodArgumentResolver {

	private final SecurityService securityService;

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.hasParameterAnnotation(LoginUser.class);
	}

	@Override
	public Object resolveArgument(MethodParameter parameter,
		ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest,
		WebDataBinderFactory binderFactory) {

		Class<?> expectedType = User.class;

		log.debug("Resolving argument for parameter: {} with expected type: {}", parameter.getParameterName(),
			expectedType.getName());

		if (!expectedType.isAssignableFrom(parameter.getParameterType())) {
			log.warn("Parameter type mismatch. Expected: {}, Actual: {}", expectedType.getName(),
				parameter.getParameterType().getName());
			return null; // 타입이 맞지 않으면 null 반환
		}

		return securityService.getAuthentication();
	}
}
