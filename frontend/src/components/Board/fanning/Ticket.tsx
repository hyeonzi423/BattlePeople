import { useState } from "react";
import PreVotingModal from "@/components/Modal/PreVotingModal";
import { TicketType } from "@/types/Board/ticket";
import { themes } from "@/assets/styles/themes";
import {
	TicketContainer,
	TicketContent,
	TicketTitle,
	Divider,
} from "@/assets/styles/ticketStyle";
import TicketDetails from "@/components/Board/fanning/TicketDetails";
import TicketBarcode from "@/components/Board/fanning/TicketBarcode";

interface TicketProps {
	ticket: TicketType;
	theme: "navy" | "yellow";
	onVote: (ticketId: number, opinionIndex: number) => Promise<void>; // onVote 속성 추가
}

function Ticket({ ticket, theme = "navy", onVote }: TicketProps) {
	const themeData = themes[theme] || themes.navy;
	const [showModal, setShowModal] = useState(false);

	const handleVote = async (opinion: string) => {
		const selectedOpinionIndex = ticket.opinions.find(
			(o) => o.opinion === opinion,
		)?.index;

		if (selectedOpinionIndex !== undefined) {
			await onVote(ticket.id, selectedOpinionIndex); // 투표 요청을 상위 컴포넌트에 전달
			setShowModal(false);
		}
	};

	return (
		<TicketContainer theme={themeData}>
			<TicketContent>
				<TicketTitle theme={themeData}>Ticket To Live</TicketTitle>
				<TicketDetails
					themeData={themeData}
					title={ticket.title}
					opinions={ticket.opinions}
					startDate={ticket.startDate}
				/>
			</TicketContent>
			<Divider />
			<TicketBarcode
				themeData={themeData}
				barcodeImage={themeData.barcodeImage}
				isVoted={ticket.isVoted}
				currentPeopleCount={ticket.currentPeopleCount}
				maxPeopleCount={ticket.maxPeopleCount}
				onAttend={() => setShowModal(true)}
			/>
			<PreVotingModal
				showModal={showModal}
				setShowModal={setShowModal}
				title={ticket.title}
				opinion1={ticket.opinions[0].opinion}
				opinion2={ticket.opinions[1].opinion}
				onVote={handleVote}
			/>
		</TicketContainer>
	);
}

export default Ticket;
