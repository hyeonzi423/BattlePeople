import { useEffect, useState } from "react";
import ModalContent from "@/components/Modal/ModalContent";
import ModalForm from "@/components/Modal/ModalForm";
import { PrticipatedVotesModalType, User } from "@/types/Board/modalTypes";
import { authService } from "@/services/userAuthService";
import person_blue from "@/assets/images/person_blue.png";
import person_orange from "@/assets/images/person_orange.png";

interface ParticipatedVotesModalProps {
	voteId: number;
	title: string;
	registDate: string;
	detail: string;
	onClose: () => void;
}

function ParticipatedVotesModal({
	voteId,
	title,
	detail,
	registDate,
	onClose,
}: ParticipatedVotesModalProps) {
	const [voteDetail, setVoteDetail] =
		useState<PrticipatedVotesModalType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	useEffect(() => {
		const fetchVoteDetail = async () => {
			try {
				const response = await authService.getVoteDetail(voteId); // Fetch vote details

				const voteDetail: PrticipatedVotesModalType = {
					id: voteId,
					title,
					registDate,
					opinions: response.opinions,
				};

				setVoteDetail(voteDetail);
			} catch (err) {
				setError("Failed to fetch vote details.");
			} finally {
				setLoading(false);
			}
		};

		fetchVoteDetail();
	}, [voteId, title, registDate]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (!voteDetail) {
		return null;
	}

	return (
		<ModalForm
			title="투표 내역 상세보기"
			infoText={title}
			summary={detail}
			onClose={onClose}
			borderColor="#fbca27"
		>
			<ModalContent
				registerUser={defaultUser1}
				oppositeUser={defaultUser2}
				speechBubbleColor="#fbca27"
				status="balance" // Assuming status is "balance", you can adjust based on your needs
				opinions={voteDetail.opinions}
			/>
		</ModalForm>
	);
}

export default ParticipatedVotesModal;
