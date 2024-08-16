package com.woowahanrabbits.battle_people.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.RequestCacheConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.woowahanrabbits.battle_people.domain.user.handler.ForbiddenExceptionHandler;
import com.woowahanrabbits.battle_people.domain.user.handler.JwtAuthenticationEntryPoint;
import com.woowahanrabbits.battle_people.domain.user.jwt.JwtFilter;
import com.woowahanrabbits.battle_people.domain.user.jwt.JwtUtil;
import com.woowahanrabbits.battle_people.domain.user.service.PrincipalDetailsService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final AuthenticationConfiguration authenticationConfiguration;
	private final JwtUtil jwtUtil;
	private final PrincipalDetailsService principalDetailsService;
	private final ForbiddenExceptionHandler forbiddenExceptionHandler;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Bean
	public AuthenticationManager authenticationManager() throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public BCryptPasswordEncoder beCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(
			Arrays.asList("http://localhost:3000", "https://i11a706.p.ssafy.io", "http://localhost",
				"https://apic.app"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
		http.requestCache(RequestCacheConfigurer::disable);
		http.csrf(AbstractHttpConfigurer::disable);
		http.formLogin(form -> form.disable());
		http.httpBasic(basic -> basic.disable());

		http.authorizeHttpRequests(auth -> auth
			.anyRequest().permitAll());
		// .requestMatchers("/user/join", "/auth/login", "/auth/logout", "/auth/refresh", "/", "/user")
		// .permitAll()
		// .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/swagger-ui.html",
		// 	"/webjars/**").permitAll() // Swagger 엔드포인트 허용
		// .anyRequest()
		// .authenticated());

		http.addFilterBefore(new JwtFilter(jwtUtil, principalDetailsService),
			UsernamePasswordAuthenticationFilter.class);
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http.exceptionHandling(exception -> exception
			.accessDeniedHandler(forbiddenExceptionHandler)
			.authenticationEntryPoint(jwtAuthenticationEntryPoint));
		return http.build();
	}

}
