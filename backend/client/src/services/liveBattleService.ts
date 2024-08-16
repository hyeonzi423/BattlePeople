import { ApiResponse } from "@/types/api";
import {
	LiveBattleCardInfo,
	FinishedLiveBattleDetail,
	WaitingLiveBattleDetail,
} from "@/types/live";
import axiosInstance from "@/services/axiosInstance";

export const liveBattleService = {
	// 대기 중인 라이브 배틀 목록 가져오기
	getWaitList: async (
		category?: number,
		page: number = 0,
		size: number = 10,
	): Promise<ApiResponse<LiveBattleCardInfo[]>> => {
		try {
			const response = await axiosInstance.get<
				ApiResponse<LiveBattleCardInfo[]>
			>("/live/wait/list", {
				params: { page, size, category },
			});
			return response.data;
		} catch (error) {
			console.error("Failed to fetch wait list:", error);
			throw error;
		}
	},

	// 진행 중인 라이브 배틀 목록 가져오기
	getActiveList: async (
		category?: number,
		page: number = 0,
		size: number = 10,
	): Promise<ApiResponse<LiveBattleCardInfo[]>> => {
		try {
			const response = await axiosInstance.get<
				ApiResponse<LiveBattleCardInfo[]>
			>("/live/active/list", {
				params: { page, size, category },
			});
			return response.data;
		} catch (error) {
			console.error("Failed to fetch active list:", error);
			throw error;
		}
	},

	// 종료된 라이브 배틀 목록 가져오기
	getEndList: async (
		category?: number,
		page: number = 0,
		size: number = 10,
	): Promise<ApiResponse<LiveBattleCardInfo[]>> => {
		try {
			const response = await axiosInstance.get<
				ApiResponse<LiveBattleCardInfo[]>
			>("/live/end/list", {
				params: { page, size, category },
			});
			return response.data;
		} catch (error) {
			console.error("Failed to fetch end list:", error);
			throw error;
		}
	},

	// 종료된 라이브 배틀 상세 정보 가져오기
	getEndDetail: async (
		battleId: string,
	): Promise<ApiResponse<FinishedLiveBattleDetail>> => {
		try {
			const response = await axiosInstance.get<
				ApiResponse<FinishedLiveBattleDetail>
			>(`/live/end/detail/${battleId}`);
			return response.data;
		} catch (error) {
			console.error(
				`Failed to fetch end detail for battle ${battleId}:`,
				error,
			);
			throw error;
		}
	},

	// 대기 중인 라이브 배틀 상세 정보 가져오기
	getWaitDetail: async (
		battleId: string,
	): Promise<ApiResponse<WaitingLiveBattleDetail>> => {
		try {
			const response = await axiosInstance.get<
				ApiResponse<WaitingLiveBattleDetail>
			>(`/live/wait/detail/${battleId}`);
			return response.data;
		} catch (error) {
			console.error(
				`Failed to fetch wait detail for battle ${battleId}:`,
				error,
			);
			throw error;
		}
	},
};
