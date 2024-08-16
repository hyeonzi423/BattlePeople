export interface OpinionType {
	index: number;
	opinion: string;
	count: number;
	percentage: number;
}

export interface BalanceGameCardType {
	id: number;
	title: string;
	detail?: string;
	startDate: string;
	endDate: string;
	category: number;
	opinions: OpinionType[];
	currentState: number;
	userVote: number | null;
}
