import { DetailUserInfo } from "./user";

export interface Notification {
	id: number;
	notifyCode: number; // live notify -> 1
	title: string;
	read: boolean;
}

export interface NotificationLiveDetail {
	id: number;
	title: string;
	notifyCode: number; // live notify -> 1
	specificData: number; // battleId
}

export interface NotificationInviteDetail {
	id: number;
	title: string;
	notifyCode: number; // invite notify -> 0
	specificData: {
		// invite detail
		battleId: number;
		title: string;
		category: number;
		registUser: DetailUserInfo;
		opinion: string;
		startDate: string; // "2024-08-09T06:37:37.000+00:00"
		minute: number;
		maxPeopleCount: number;
	};
}

export type Detail = NotificationLiveDetail | NotificationInviteDetail;
