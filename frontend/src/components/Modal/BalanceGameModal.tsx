import ModalContent from "@/components/Modal/ModalContent";
import ModalForm from "@/components/Modal/ModalForm";
import { BalanceGameModalType, User } from "@/types/Board/modalTypes";
import person_blue from "@/assets/images/person_blue.png";
import person_orange from "@/assets/images/person_orange.png";

interface BalanceGameModalProps {
	data: BalanceGameModalType;
	onClose: () => void;
}

const defaultUser1: User = {
	id: 0,
	nickname: "",
	imgUrl: person_orange,
	opinion: "No opinion",
};

const defaultUser2: User = {
	id: 0,
	nickname: "",
	imgUrl: person_blue,
	opinion: "No opinion",
};

function BalanceGameModal({ data, onClose }: BalanceGameModalProps) {
	if (!data) {
		return null;
	}

	const { title, detail, opinions } = data;

	return (
		<ModalForm
			title="밸런스게임 상세보기"
			infoText={title}
			summary={detail}
			onClose={onClose}
			borderColor="#fbca27"
		>
			<ModalContent
				registerUser={defaultUser1}
				oppositeUser={defaultUser2}
				speechBubbleColor="#fbca27"
				status="balance"
				opinions={opinions}
			/>
		</ModalForm>
	);
}

export default BalanceGameModal;
