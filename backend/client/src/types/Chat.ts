import { BasicUserInfo } from "./user";

export interface ChatMessage {
	user: BasicUserInfo;
	message: string;
	userVote: number | null;
	idx: number;
}

export interface SpeechRequestMessage {
	user: BasicUserInfo;
	userVote: number | null;
	idx: number;
}
