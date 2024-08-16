import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/userAuthStore";
import BalanceGameModal from "@/components/Modal/BalanceGameModal";
import {
	BalanceGameCardType,
	OpinionType,
} from "@/types/Board/balancegameCard";
import ActiveBalanceGameCard from "@/components/Board/bonfire/ActiveBalanceGameCard";
import EndedBalanceGameCard from "@/components/Board/bonfire/EndedBalanceGameCard";
import {
	BalanceGameCardWrapper,
	Question,
} from "@/assets/styles/balanceGameStyle";
import fireExtinguisher from "@/assets/images/fireExtinguisher.gif";
import fire from "@/assets/images/fire.gif";
import { balanceGameService } from "@/services/balanceGameService";

interface BalanceGameCardProps {
	data: BalanceGameCardType;
	onVote: (cardId: number, updatedOpinions: OpinionType[]) => void;
	disabled: boolean;
	isEnded: boolean;
}

const LikeImage = styled.img`
	width: 50px;
	height: 50px;
	margin-right: 8px;
`;

function BalanceGameCard({
	data,
	onVote,
	disabled,
	isEnded,
}: BalanceGameCardProps) {
	const [hasVoted, setHasVoted] = useState(
		data.userVote !== null && data.userVote !== undefined,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState<BalanceGameCardType | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const { isLogin, user } = useAuthStore();

	const handleCardClick = async () => {
		setIsLoading(true);
		try {
			const response = await balanceGameService.getBalanceGameById(
				data.id.toString(),
			);
			setModalData(response.data as unknown as BalanceGameCardType);
			setIsModalOpen(true);
		} catch (error) {
			console.error("Failed to fetch balance game details:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleVoteClick = (option: number) => {
		if (!isLogin || !user) {
			toast.error("로그인이 필요합니다", { autoClose: 1000 });
			navigate("/login");
			return;
		}

		if (hasVoted || disabled) return;

		const selectedOpinion = data.opinions.find(
			(opinion) => opinion.index === option,
		);

		if (!selectedOpinion) {
			console.error("Selected opinion not found");
			return;
		}

		setHasVoted(true);
		// selectedOpinion을 배열로 감싸서 전달합니다.
		onVote(data.id, [selectedOpinion]);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setModalData(null);
	};

	return (
		<>
			<BalanceGameCardWrapper>
				<Question onClick={handleCardClick}>
					{isEnded && <LikeImage src={fireExtinguisher} alt="Ended" />}
					{!isEnded && <LikeImage src={fire} alt="Ing" />}
					{data.title}
				</Question>
				{hasVoted || disabled ? (
					<EndedBalanceGameCard
						opinions={data.opinions}
						userVote={data.userVote}
					/>
				) : (
					<ActiveBalanceGameCard
						opinions={data.opinions}
						onVote={handleVoteClick}
					/>
				)}
			</BalanceGameCardWrapper>
			{isLoading && <div>Loading...</div>}
			{isModalOpen && modalData && (
				<BalanceGameModal
					data={{
						...modalData,
						detail: modalData.detail ?? "No details available",
					}}
					onClose={handleCloseModal}
				/>
			)}
		</>
	);
}

export default BalanceGameCard;
