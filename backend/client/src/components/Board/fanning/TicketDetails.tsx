import {
	EventDetails,
	EventTitle,
	EventSubtitle,
	EventTime,
} from "@/assets/styles/ticketStyle";
import { themes } from "@/assets/styles/themes";
import { Opinion } from "@/types/Board/ticket";

interface TicketDetailsProps {
	themeData: typeof themes.navy | typeof themes.yellow;
	title: string;
	opinions: Opinion[];
	startDate: string;
}

function TicketDetails({
	themeData,
	title,
	opinions,
	startDate,
}: TicketDetailsProps) {
	return (
		<EventDetails theme={themeData}>
			<EventTitle theme={themeData}>{title}</EventTitle>
			<EventSubtitle theme={themeData}>
				{`${opinions[0].opinion} VS ${opinions[1].opinion}`}
			</EventSubtitle>
			<EventTime theme={themeData}>{startDate}</EventTime>
		</EventDetails>
	);
}

export default TicketDetails;
