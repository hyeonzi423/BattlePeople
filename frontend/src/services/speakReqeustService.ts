// import { ApiResponse } from "@/types/api";
// import { SpeakRequest } from "@/types/live";
// import axiosInstance from "@/services/axiosInstance";

// export const getSpeackReqeustList = async (
// 	battleId: string,
// ): Promise<ApiResponse<SpeakRequest[]>> => {
// 	try {
// 		const response = await axiosInstance.get(
// 			`/openvidu/user-speak-request/${battleId}`,
// 		);
// 		console.log(response.data);
// 		return response.data;
// 	} catch (error) {
// 		console.error("Failed to fetch notifications:", error);
// 		throw error;
// 	}
// };
