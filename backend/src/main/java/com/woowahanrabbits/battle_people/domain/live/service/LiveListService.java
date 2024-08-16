package com.woowahanrabbits.battle_people.domain.live.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.woowahanrabbits.battle_people.domain.live.dto.LiveEndDetailDto;
import com.woowahanrabbits.battle_people.domain.live.dto.LiveListResponseDto;

public interface LiveListService {
	Page<LiveListResponseDto> getActiveLiveList(String keyword, Integer category, Pageable pageable);

	Page<LiveListResponseDto> getWaitLiveList(String keyword, Integer category, Pageable pageable);

	Page<LiveListResponseDto> getEndLiveList(String keyword, Integer category, Pageable pageable);

	LiveListResponseDto getLiveInfo(Long battleId);

	LiveEndDetailDto getEndLiveSummary(Long battleId);

}
