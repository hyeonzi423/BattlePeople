package com.woowahanrabbits.battle_people.domain.live.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;
import com.woowahanrabbits.battle_people.domain.live.dto.LiveEndDetailDto;
import com.woowahanrabbits.battle_people.domain.live.dto.LiveListResponseDto;
import com.woowahanrabbits.battle_people.domain.live.service.LiveListService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/live")
public class LiveListController {
	private final LiveListService liveListService;

	@GetMapping("/active/list")
	@Operation(summary = "[활활] 라이브 진행중인 토론 리스트 조회")
	public ResponseEntity<ApiResponseDto<List<LiveListResponseDto>>> getActiveLiveList(
		@RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
		@RequestParam(value = "category", required = false, defaultValue = "") Integer category,
		@PageableDefault(page = 0, size = 10) Pageable pageable) {

		try {
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponseDto<>("success", "",
					liveListService.getActiveLiveList(keyword, category, pageable).getContent()));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponseDto<>("fail", "internal server error", null));
		}
	}

	@GetMapping("/wait/list")
	@Operation(summary = "[불꽃] 라이브 예정인 토론 리스트 조회")
	public ResponseEntity<ApiResponseDto<List<LiveListResponseDto>>> getWaitLiveList(
		@RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
		@RequestParam(value = "category", required = false, defaultValue = "") Integer category,
		@PageableDefault(page = 0, size = 10) Pageable pageable) {

		try {
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponseDto<>("success", "",
					liveListService.getWaitLiveList(keyword, category, pageable).getContent()));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponseDto<>("fail", "internal server error", null));
		}
	}

	@GetMapping("/end/list")
	@Operation(summary = "[잿더미] 라이브 종료된 토론 리스트 조회")
	public ResponseEntity<ApiResponseDto<List<LiveListResponseDto>>> getEndBattleBoards(
		@RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
		@RequestParam(value = "category", required = false, defaultValue = "") Integer category,
		@PageableDefault(page = 0, size = 10) Pageable pageable) {

		try {
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponseDto<>("success", "",
					liveListService.getEndLiveList(keyword, category, pageable).getContent()));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponseDto<>("fail", "internal server error", null));
		}
	}

	@GetMapping("/wait/detail/{battle_id}")
	@Operation(summary = "[불꽃] 라이브 예정 중인 토론 하나에 대한 상세 정보 조회")
	public ResponseEntity<ApiResponseDto<LiveListResponseDto>> getWaitLiveInfo(
		@PathVariable("battle_id") Long battleId) {

		try {
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponseDto<>("success", "", liveListService.getLiveInfo(battleId)));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponseDto<>("fail", "internal server error", null));
		}
	}

	@GetMapping("/end/detail/{battle_id}")
	@Operation(summary = "[잿더미] 라이브 종료된 토론 하나에 대한 상세 정보 조회")
	public ResponseEntity<ApiResponseDto<LiveEndDetailDto>> getEndLiveInfo(@PathVariable("battle_id") Long battleId) {

		try {
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponseDto<>("success", "", liveListService.getEndLiveSummary(battleId)));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponseDto<>("fail", "internal server error", null));
		}
	}
}
