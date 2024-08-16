package com.woowahanrabbits.battle_people.domain.battle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThumbnailRequestDto {

	private String model;
	private String prompt;
	@JsonProperty("n")
	private int num;
	private String size;

	public ThumbnailRequestDto(BattleInfoDto battleInfoDto) {
		this.model = "dall-e-3";
		this.num = 1;
		this.size = "1792x1024";
		this.prompt = battleInfoDto.toString()
			+ "해당 주제에 대한 opinions 두개가 토론이나 가벼운 라이브 대결을 진행 예정인데 해당 라이브에 넣을만한 썸네일 이미지를 제작해줘."
			+ " 폭력적인 부분은 넣지 말아줘. 밝고 생동감이 넘치고 재밌는 분위기로 제작해줘. Don't write anything on picture. "
			+ "레트로, 픽셀이미지, 귀엽게, 단순하게 와이드스크린";
	}
}
