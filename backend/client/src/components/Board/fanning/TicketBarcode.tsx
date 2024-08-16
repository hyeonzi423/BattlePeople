import {
	BarcodeContainer,
	BarcodeImage,
	AttendButton,
	AttendCount,
} from "@/assets/styles/ticketStyle";
import { themes } from "@/assets/styles/themes";

interface TicketBarcodeProps {
	themeData: typeof themes.navy | typeof themes.yellow;
	barcodeImage: string;
	isVoted: boolean;
	currentPeopleCount: number;
	maxPeopleCount: number;
	onAttend: () => void;
}

function TicketBarcode({
	themeData,
	barcodeImage,
	isVoted,
	currentPeopleCount,
	maxPeopleCount,
	onAttend,
}: TicketBarcodeProps) {
	const handleClick = () => {
		if (!isVoted) {
			onAttend();
		}
	};

	return (
		<BarcodeContainer>
			<BarcodeImage src={barcodeImage} alt="Barcode" />
			<AttendButton theme={themeData} onClick={handleClick} disabled={isVoted}>
				{isVoted ? "완료" : "참석"}
			</AttendButton>
			<AttendCount theme={themeData}>
				{`${currentPeopleCount}/${maxPeopleCount}`}
			</AttendCount>
		</BarcodeContainer>
	);
}

export default TicketBarcode;
