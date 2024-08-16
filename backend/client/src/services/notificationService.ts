import { Notification } from "@/types/notification";
import { ApiResponse } from "@/types/api";
import axiosInstance from "@/services/axiosInstance";

export const notificationService = {
	// 사용자 알림 전체 조회
	getNotificationList: async (): Promise<ApiResponse<Notification[]>> => {
		try {
			const response = await axiosInstance.get(`/notify`);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
			throw error;
		}
	},

	// 알림 별 상세 내역 조회
	getNotificationDetail: async (id: number) => {
		try {
			const response = await axiosInstance.get(`/notify/detail/${id}`);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
			throw error;
		}
	},

	// 알림 삭제
	deleteNotification: async (id: number): Promise<boolean> => {
		try {
			const response = await axiosInstance.delete<Notification[]>(
				`/notify/${id}`,
			);
			return response.status === 204;
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
			throw error;
		}
	},

	// 배틀 수락 및 거절 전송
	sendAcceptOrDecline: async (
		battleId: number,
		respond: string,
		content: string,
	): Promise<boolean> => {
		try {
			const response = await axiosInstance.put<Notification[]>(
				"/battle/accept-or-decline",
				{
					battleId,
					respond,
					content,
				},
			);
			return response.status === 204;
		} catch (error) {
			console.error("Failed to send accept or decline response:", error);
			throw error;
		}
	},
};

// 새로운 알림 탐색
// export const getNewNotification = async (): Promise<ApiResponse<boolean>> => {
// 	try {
// 		const response = await axiosInstance.get(`/notify/unread`);
// 		return response.data;
// 	} catch (error) {
// 		console.error("Failed to fetch notifications:", error);
// 		throw error;
// 	}
// };
