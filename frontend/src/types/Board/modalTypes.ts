export interface User {
	id: number;
	nickname: string;
	imgUrl: string;
	opinion: string;
}

export interface Result {
	percentageRegisterOpinion: number;
	percentageOppositeOpinion: number;
}

export interface EndedLivePreviewModalType {
	id: number;
	title: string;
	registerUser: User;
	oppositeUser: User;
	preResult: Result;
	finalResult: Result;
	category: string;
	imageUri: string;
	summary: string;
}

export interface UpcomingLivePreviewModalType {
	id: number;
	roomId: string;
	title: string;
	registerUser: User;
	oppositeUser: User;
	startDate: string;
	endDate: string;
	currentPeopleCount: number;
	category: string;
	imageUri: string;
	battleRule: string;
	summary: string;
}

export interface Opinion {
	index: number;
	opinion: string;
	count: number;
	percentage: number;
}

export interface BalanceGameModalType {
	id: number;
	title: string;
	detail: string;
	startDate: string;
	endDate: string;
	category: number;
	opinions: Opinion[];
	currentState: number;
	userVote: number | null;
}

export interface PrticipatedVotesModalType {
	id: number;
	title: string;
	registDate: string;
	opinions: Opinion[];
}
