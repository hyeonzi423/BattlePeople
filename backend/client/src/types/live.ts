import { BasicUserInfo } from "./user";

interface LiveBattle {
	id: number;
	title: string;
	registerUser: UserWithOpinion;
	oppositeUser: UserWithOpinion;
	category: number;
	imageUri?: string;
}

export interface LiveBattleCardInfo extends LiveBattle {
	roomId: string;
	startDate: string;
	endDate: string;
	currentPeopleCount?: number;
}

export interface WaitingLiveBattleDetail extends LiveBattleCardInfo {
	summary?: string;
}

export interface FinishedLiveBattleDetail extends LiveBattle {
	preResult: LiveVoteResult;
	preResultCount: LiveVoteResult;
	finalResult: LiveVoteResult;
	finalResultCount: LiveVoteResult;
	summary?: string;
}

export interface UserWithOpinion extends BasicUserInfo {
	opinion: string;
}

interface LiveVoteResult {
	percentageRegisterOpinion: number;
	percentageOppositeOpinion: number;
}

export interface LiveViewer extends BasicUserInfo {
	inTime: string;
	outTime?: string;
}

export interface SpeakRequest {
	userVote: 0;
	requestUserId: 1;
	hostUserId: 2;
	connectionId: "abcdefg";
	idx: 1;
	nickname: "judy";
}
