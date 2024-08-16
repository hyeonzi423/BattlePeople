import {
	ApiResponse,
	BattleResponse,
	BattleInviteRequest,
	BattleInviteRespondRequest,
	ApplyBattleRequest,
} from "@/types/api";
import { BattleWaitingParticipant } from "@/types/battle";
import axiosInstance from "@/services/axiosInstance";

export const battleService = {
	// 배틀 목록 가져오기
	getBattles: async (
		category: number,
		page: number = 0,
		size: number = 10,
	): Promise<ApiResponse<BattleResponse[]>> => {
		try {
			const response = await axiosInstance.get<ApiResponse<BattleResponse[]>>(
				"/battle",
				{
					params: { category, page, size },
				},
			);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch battles:", error);
			throw error;
		}
	},

	// 배틀 초대하기
	inviteBattle: async (
		data: BattleInviteRequest,
	): Promise<ApiResponse<string>> => {
		try {
			const response = await axiosInstance.post<ApiResponse<string>>(
				"/battle/invite",
				data,
			);
			return response.data;
		} catch (error) {
			console.error("Failed to invite to battle:", error);
			throw error;
		}
	},

	// 배틀 초대 응답하기
	respondToBattleInvite: async (
		data: BattleInviteRespondRequest,
	): Promise<ApiResponse<string>> => {
		try {
			const response = await axiosInstance.post<ApiResponse<string>>(
				"/battle/accept-or-decline",
				data,
			);
			return response.data;
		} catch (error) {
			console.error(`Failed to ${data.respond} battle invite:`, error);
			throw error;
		}
	},

	// 배틀 신청 목록 가져오기
	getApplyList: async (
		category?: number,
		page: number = 0,
		size: number = 10,
	): Promise<ApiResponse<BattleWaitingParticipant[]>> => {
		try {
			const response = await axiosInstance.get<
				ApiResponse<BattleWaitingParticipant[]>
			>("/battle/apply-list", {
				params: { page, size, category },
			});
			return response.data;
		} catch (error) {
			console.error("Failed to fetch apply list:", error);
			throw error;
		}
	},

	// 배틀 사전 신청하기
	preVoteToBattle: async (
		data: ApplyBattleRequest,
	): Promise<ApiResponse<number>> => {
		try {
			const response = await axiosInstance.post<ApiResponse<number>>(
				"/battle/apply",
				data,
			);
			return response.data;
		} catch (error) {
			console.error("Failed to apply to battle:", error);
			throw error;
		}
	},
};
