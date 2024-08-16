package com.woowahanrabbits.battle_people.domain.balancegame.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.woowahanrabbits.battle_people.domain.api.dto.ApiResponseDto;
import com.woowahanrabbits.battle_people.domain.balancegame.dto.BalanceGameResponse;
import com.woowahanrabbits.battle_people.domain.balancegame.dto.CreateBalanceGameRequest;
import com.woowahanrabbits.battle_people.domain.balancegame.service.BalanceGameService;
import com.woowahanrabbits.battle_people.domain.battle.infrastructure.BattleRepository;
import com.woowahanrabbits.battle_people.domain.user.domain.User;
import com.woowahanrabbits.battle_people.domain.user.resolver.LoginUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/balance-game")
@RequiredArgsConstructor
@Tag(name = "BalanceGameController", description = "밸런스게임 컨트롤러")
public class BalanceGameController {

	private final BalanceGameService balanceGameService;
	private final BattleRepository battleRepository;

	@PostMapping("")
	@PreAuthorize("isAuthenticated()")
	@Operation(summary = "[점화] 밸런스 게임을 생성한다.")
	public ResponseEntity<?> registBalanceGame(@RequestBody @Valid CreateBalanceGameRequest createBalanceGameRequest,
		@LoginUser User user) {
		balanceGameService.addBalanceGame(createBalanceGameRequest, user);
		return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDto<>("success", "", null));
	}

	@GetMapping("")
	@Operation(summary = "[점화] 카테고리 별, 진행 상태 별 밸런스 게임 조회 ")
	public ResponseEntity<ApiResponseDto<?>> getBalanceGameByConditions(
		@RequestParam(defaultValue = "") Integer category,
		@RequestParam(defaultValue = "5") int status, @RequestParam int page, @RequestParam int size,
		@LoginUser User user) {

		return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDto<>("success", "",
			balanceGameService.getBalanceGameByConditions(category, status, page, user, size)));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Id 값으로 밸런스 게임 조회")
	public ResponseEntity<ApiResponseDto<?>> getBalanceGameById(@PathVariable Long id, @LoginUser User user) {
		BalanceGameResponse balanceGameResponse = balanceGameService.getBalanceGameById(id, user);
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ApiResponseDto<>("success", "", balanceGameResponse));
	}

}
