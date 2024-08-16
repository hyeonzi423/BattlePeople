package com.woowahanrabbits.battle_people.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {
	@Bean
	public OpenAPI openAPI() {
		return new OpenAPI()
			.components(new Components().addSecuritySchemes("bearer-key",
				new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")))
			.info(apiInfo())
			.addSecurityItem(new SecurityRequirement().addList("bearer-key"));
	}

	private Info apiInfo() {
		return new Info()
			.title("SSAFIT")
			.description("<h3>SSAFIT에서 사용되는 RESTAPI에 대한 문서를 제공한다.</h3>")
			.version("1.0.0");
	}
}
