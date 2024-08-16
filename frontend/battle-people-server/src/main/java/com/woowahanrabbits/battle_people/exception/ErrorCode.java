package com.woowahanrabbits.battle_people.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

	INVALID_BATTLE_TIME("최소 10분부터 최대 60분까지 설정 가능합니다."),
	INVALID_USER("유저 설정이 유효하지 않습니다."),
	INVALID_BATTLE_STARTTIME("시작 시간은 최소 60분 후부터 가능합니다."),
	INVALID_OPINION_LENGTH("선택지는 최대 16자까지 작성 가능합니다."),
	DUPLICATED_BATTLE("이미 해당시간에 예정된 배틀이 존재합니다."),
	ENDED_BATTLE("응답 기간이 종료된 배틀입니다."),
	INVALID_USER6("유저 설정이 유효하지 않습니다."),
	INVALID_USER7("유저 설정이 유효하지 않습니다.");

	private final String message;
}
