export interface Opinion {
	index: number;
	opinion: string;
}

export interface TicketType {
	id: number;
	title: string;
	opinions: Opinion[];
	startDate: string;
	endDate: string;
	maxPeopleCount: number;
	currentPeopleCount: number;
	isVoted: boolean;
}

export interface ExampleProps {
	tickets: TicketType[];
}
