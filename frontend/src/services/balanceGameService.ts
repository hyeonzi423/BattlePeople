import {
	ApiResponse,
	BalanceGameResponse,
	CreateBalanceGameRequest,
} from "@/types/api";
import { OpinionWithPercentage } from "@/types/vote";
import axiosInstance from "@/services/axiosInstance";

export const balanceGameService = {
	getBalanceGames: async (
		category?: number,
		status: number = 6,
		page: number = 0,
		size: number = 10,
	): Promise<ApiResponse<BalanceGameResponse[]>> => {
		try {
			const response = await axiosInstance.get<
				ApiResponse<BalanceGameResponse[]>
			>("/balance-game", {
				params: { page, size, category, status },
			});
			return response.data;
		} catch (error) {
			console.error("Failed to fetch balance games:", error);
			throw error;
		}
	},

	createBalanceGame: async (
		data: CreateBalanceGameRequest,
	): Promise<ApiResponse<string>> => {
		try {
			const response = await axiosInstance.post<ApiResponse<string>>(
				"/balance-game",
				data,
			);
			return response.data;
		} catch (error) {
			console.error("Failed to create balance game:", error);
			throw error;
		}
	},

	deleteBalanceGame: async (): Promise<ApiResponse<string>> => {
		try {
			const response =
				await axiosInstance.delete<ApiResponse<string>>("/balance-game");
			return response.data;
		} catch (error) {
			console.error("Failed to delete balance game:", error);
			throw error;
		}
	},

	getBalanceGameById: async (
		id: string,
	): Promise<ApiResponse<BalanceGameResponse>> => {
		try {
			const response = await axiosInstance.get<
				ApiResponse<BalanceGameResponse>
			>(`/balance-game/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Failed to fetch balance game with id ${id}:`, error);
			throw error;
		}
	},
	voteBalanceGame: async (
		battleId: number,
		voteOpinionIndex: number,
	): Promise<ApiResponse<{ opinions: OpinionWithPercentage[] }>> => {
		try {
			const response = await axiosInstance.post<
				ApiResponse<{ opinions: OpinionWithPercentage[] }>
			>(`/vote/user-vote-balance-game/${battleId}`, null, {
				params: {
					voteOpinionIndex,
				},
			});
			return response.data;
		} catch (error) {
			console.error("Failed to submit vote:", error);
			throw error;
		}
	},
};
