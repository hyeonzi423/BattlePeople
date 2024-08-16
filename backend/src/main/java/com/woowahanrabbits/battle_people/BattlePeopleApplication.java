package com.woowahanrabbits.battle_people;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity(securedEnabled = true)
@EnableScheduling
public class BattlePeopleApplication {

	public static void main(String[] args) {
		SpringApplication.run(BattlePeopleApplication.class, args);
	}

}
