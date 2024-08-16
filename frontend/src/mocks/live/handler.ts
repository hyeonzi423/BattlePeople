import { http, HttpResponse } from "msw";

import { ApiResponse } from "@/types/api";
import {
	generateFinishedLiveBattleResponse,
	generateLiveBattleCard,
} from "@/mocks/util";
import { FinishedLiveBattleDetail, LiveBattleCardInfo } from "@/types/live";

export const handlers = [
	http.get<never, never, ApiResponse<LiveBattleCardInfo[]>>(
		"/battle-people/live/wait/list",
		async ({ request }) => {
			const qs = new URLSearchParams(request.url);
			const category = Number(qs.get("category"));
			const size = Number(qs.get("size") || 10);
			const liveBattles = Array.from({ length: size }, () =>
				generateLiveBattleCard(category),
			);
			return HttpResponse.json({
				code: "success",
				data: liveBattles,
			});
		},
	),
	http.get<never, never, ApiResponse<LiveBattleCardInfo[]>>(
		"/battle-people/live/active/list",
		async ({ request }) => {
			const qs = new URLSearchParams(request.url);
			const category = Number(qs.get("category"));
			const size = Number(qs.get("size") || 10);
			const liveBattles = Array.from({ length: size }, () =>
				generateLiveBattleCard(category),
			);
			return HttpResponse.json({
				code: "success",
				data: liveBattles,
			});
		},
	),
	http.get<never, never, ApiResponse<LiveBattleCardInfo[]>>(
		"/battle-people/live/end/list",
		async ({ request }) => {
			const qs = new URLSearchParams(request.url);
			const category = Number(qs.get("category"));
			const size = Number(qs.get("size") || 10);
			const liveBattles = Array.from({ length: size }, () =>
				generateLiveBattleCard(category),
			);
			return HttpResponse.json({
				code: "success",
				data: liveBattles,
			});
		},
	),
	http.get<{ battleId: string }, never, ApiResponse<FinishedLiveBattleDetail>>(
		"/battle-people/live/end/detail/:battleId",
		async ({ params }) => {
			const battleId = Number(params.battleId);
			const battle = generateFinishedLiveBattleResponse(
				battleId,
				Math.floor(Math.random() * 7),
			);
			return HttpResponse.json({
				code: "success",
				data: battle,
			});
		},
	),
	http.get<{ battleId: string }, never, ApiResponse<LiveBattleCardInfo>>(
		"/battle-people/live/wait/detail/:battleId",
		async ({ params }) => {
			const battle = generateLiveBattleCard(
				Math.floor(Math.random() * 7),
				Number(params.battleId),
			);
			return HttpResponse.json({
				code: "success",
				data: battle,
			});
		},
	),
];
