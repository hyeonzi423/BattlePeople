import { BasicUserInfo } from "./user";
import { Opinion, Vote } from "./vote";

export interface Battle {
	id: number;
	registUser: BasicUserInfo;
	oppositeUser: BasicUserInfo;
	voteInfo: Vote;

	minPeopleCount: number;
	maxPeopleCount: number;
	registDate: string;
	currentState: number;
	imageUrl?: string;
}

export interface BattleWaitingParticipant {
	id: number;
	title: string;
	opinions: Opinion[];
	startDate: string;
	endDate: string;
	maxPeopleCount: number;
	currentPeopleCount: number;
	isVoted: boolean;
}
