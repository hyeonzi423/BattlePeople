export interface SpeakResponse {
	nickname: string;
	userVote: number;
	requestUserId: number;
	hostUserId: number;
	connectionId: string;
	idx: number;
}

export interface ItemResponse {
	userId: number;
	targetIndex: number;
	itemCode: number;
}

export interface SpeakRequest {
	type: "speak";
	data: {
		userId: number;
		connectionId: string;
	};
}

export interface VoteRequest {
	type: "vote";
	data: {
		userId: number;
		voteInfoIndex: number;
	};
}

export interface ItemRequest {
	type: "item";
	data: {
		userId: number;
		targetIndex: number;
		itemCode: number;
	};
}
