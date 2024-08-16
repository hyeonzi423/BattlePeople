import { http, HttpResponse } from "msw";

import {
	ApiResponse,
	ApplyBattleRequest,
	BattleInviteRequest,
	BattleInviteRespondRequest,
	BattleResponse,
} from "@/types/api";
import {
	generateBattleResponse,
	generateBattleWaitingParticipant,
} from "@/mocks/util";
import { BattleWaitingParticipant } from "@/types/battle";

export const handlers = [
	http.get<never, never, ApiResponse<BattleResponse[]>>(
		"/battle-people/battle",
		async ({ request }) => {
			const qs = new URLSearchParams(request.url);
			const page = Number(qs.get("page") || 1);
			const size = Number(qs.get("size") || 10);
			const battles = Array.from({ length: size }, (_, index) =>
				generateBattleResponse((page - 1) * size + index + 1),
			);
			return HttpResponse.json({
				code: "success",
				data: battles,
			});
		},
	),
	http.post<never, BattleInviteRequest, ApiResponse<string>>(
		"/battle-people/battle/invite",
		() => {
			return HttpResponse.json({
				code: "success",
				data: "",
			});
		},
	),
	http.post<never, BattleInviteRespondRequest, ApiResponse<string>>(
		"/battle-people/battle/accept",
		() => {
			return HttpResponse.json({
				code: "success",
				data: "",
			});
		},
	),
	http.post<never, BattleInviteRespondRequest, ApiResponse<string>>(
		"/battle-people/battle/decline",
		() => {
			return HttpResponse.json({
				code: "success",
				data: "",
			});
		},
	),
	http.get<never, never, ApiResponse<BattleWaitingParticipant[]>>(
		"/battle-people/battle/apply-list",
		async ({ request }) => {
			const qs = new URLSearchParams(request.url);
			const size = Number(qs.get("size") || 10);
			const battles = Array.from({ length: size }, () =>
				generateBattleWaitingParticipant(),
			);
			return HttpResponse.json({
				code: "success",
				data: battles,
			});
		},
	),
	http.post<never, ApplyBattleRequest, ApiResponse<number>>(
		"/battle-people/battle/apply",
		() => {
			return HttpResponse.json({
				code: "success",
				data: Math.floor(Math.random() * 10),
			});
		},
	),
];
