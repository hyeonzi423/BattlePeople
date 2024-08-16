import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardType } from "@/types/Board/liveBoardCard";
import UpcomingLivePreviewModal from "@/components/Modal/UpcomingLivePreviewModal";
import EndedLivePreviewModal from "@/components/Modal/EndedLivePreviewModal";
import { createLiveStateBorder } from "@/utils/textBorder";
import { convertToTimeZone } from "@/utils/dateUtils";
import noImage from "@/assets/images/noImage.png";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

const getLiveStatusBackgroundColor = (status: string, index: number) => {
	if (status === "live") return "bg-transparent";
	if (status === "ended") return "bg-gray-500";
	const colors = ["bg-orange", "bg-blue", "bg-yellow", "bg-olive"];
	return colors[index % colors.length];
};

const getLiveStatusBackgroundText = (status: string) => {
	switch (status) {
		case "live":
			return "라이브";
		case "upcoming":
			return "예정된 라이브";
		case "ended":
			return "종료된 라이브";
		default:
			return "";
	}
};

function LiveCard({ card }: { card: CardType }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
	const navigate = useNavigate();

	const handleCardClick = () => {
		if (card.status !== "live") {
			setIsModalOpen(true);
		}
		if (card.status === "live") {
			navigate(`/live/${card.id}`, {
				state: { ...card },
			});
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			handleCardClick();
		}
	};

	const renderStatusOverlay = () => {
		if (card.status === "live") {
			return (
				<div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded z-10">
					라이브
				</div>
			);
		}

		const borderStyles = createLiveStateBorder("black", 3);

		return (
			<>
				<div
					className={`absolute inset-0 ${getLiveStatusBackgroundColor(card.status, card.id)} opacity-75 flex items-center justify-center`}
				/>
				<div
					className="absolute inset-0 flex items-center justify-center text-white text-3xl"
					style={borderStyles}
				>
					{getLiveStatusBackgroundText(card.status)}
				</div>
			</>
		);
	};

	return (
		<>
			<div
				className="relative flex flex-col border-solid border-black border-4 shadow-md rounded-xl overflow-hidden focus:shadow-lg focus:-translate-y-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm"
				style={{ height: "18.75rem" }}
				onClick={handleCardClick}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				role="button"
				aria-pressed="false"
			>
				<div
					ref={ref}
					className="live-card-image h-44 relative overflow-hidden"
				>
					{isIntersecting ? (
						<img
							src={card.image_uri || noImage}
							alt={card.title}
							className="w-full h-full object-cover"
						/>
					) : (
						<div>Loading...</div>
					)}
					{renderStatusOverlay()}
				</div>
				<div className="live-card-info bg-white py-4 px-3 border-t-4 border-solid">
					<h3 className="text-xl mb-2 font-medium">{card.title}</h3>
					<div className="flex justify-between items-center">
						<p className="text-base text-black">{card.regist_user_id}</p>
						{card.status === "upcoming" && card.start_date && (
							<div className="text-sm text-black">
								{convertToTimeZone(card.start_date, "Asia/Seoul")}
							</div>
						)}
						{card.status === "live" && (
							<div className="text-sm text-black">
								조회수 {card.currentPeopleCount}
							</div>
						)}
					</div>
				</div>
			</div>
			{isModalOpen && card.status === "upcoming" && (
				<UpcomingLivePreviewModal
					battleId={card.id}
					onClose={handleCloseModal}
				/>
			)}
			{isModalOpen && card.status === "ended" && (
				<EndedLivePreviewModal battleId={card.id} onClose={handleCloseModal} />
			)}
		</>
	);
}

export default LiveCard;
