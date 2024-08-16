export interface Vote {
	id?: number;
	title: string;
	detail?: string;
	startDate: string;
	endDate: string;
	category: number;
}

export interface Opinion {
	index: number;
	opinion: string;
}

export interface OpinionWithPercentage extends Opinion {
	count: number;
	percentage: number;
}

export interface VoteInfoResponse {
	totalCount: number;
	opinions: OpinionWithPercentage[];
	userVoteOpinion: number;
}
