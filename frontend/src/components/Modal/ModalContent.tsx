import { Opponents as StyledOpponents, VS } from "@/assets/styles/modalStyles";
import Opponent from "@/components/Modal/Opponent";
import VoteResultBar from "@/components/Modal/VoteResultBar";
import { Result, Opinion } from "@/types/Board/modalTypes";

interface UserProps {
	nickname: string;
	imgUrl: string;
	opinion: string;
}

interface OpponentsProps {
	registerUser: UserProps;
	oppositeUser: UserProps;
	speechBubbleColor: string;
	status: "upcoming" | "ended" | "balance";
	preResult?: Result;
	finalResult?: Result;
	preResultCount?: Result;
	finalResultCount?: Result;
	opinions?: Opinion[];
}

function ModalContent({
	registerUser,
	oppositeUser,
	speechBubbleColor,
	status,
	preResult,
	finalResult,
	preResultCount,
	finalResultCount,
	opinions = [],
}: OpponentsProps) {
	const oppositeUserOpinion =
		status === "balance" && opinions.length >= 2
			? opinions[1].opinion
			: oppositeUser.opinion;

	const registerUserOpinion =
		status === "balance" && opinions.length >= 2
			? opinions[0].opinion
			: registerUser.opinion;

	return (
		<StyledOpponents>
			<Opponent
				nickname={registerUser.nickname}
				imgUrl={registerUser.imgUrl}
				opinion={registerUserOpinion}
				speechBubbleColor={speechBubbleColor}
			/>
			{status === "upcoming" && <VS>VS</VS>}
			{status === "ended" && preResult && finalResult && (
				<div style={{ width: "100%" }}>
					<VoteResultBar
						title="사전 투표"
						percentageRegisterOpinion={preResult.percentageRegisterOpinion}
						percentageOppositeOpinion={preResult.percentageOppositeOpinion}
						countRegisterOpinion={preResultCount?.percentageRegisterOpinion}
						countOppositeOpinion={preResultCount?.percentageOppositeOpinion}
						registerColor="#FFC7C2"
						oppositeColor="#BDE3FF"
					/>
					<VoteResultBar
						title="최종 투표"
						percentageRegisterOpinion={finalResult.percentageRegisterOpinion}
						percentageOppositeOpinion={finalResult.percentageOppositeOpinion}
						countRegisterOpinion={finalResultCount?.percentageRegisterOpinion}
						countOppositeOpinion={finalResultCount?.percentageOppositeOpinion}
						registerColor="#FFC7C2"
						oppositeColor="#BDE3FF"
					/>
				</div>
			)}
			{status === "balance" && opinions.length >= 2 && (
				<div style={{ width: "100%" }}>
					<VoteResultBar
						title="투표 결과"
						percentageRegisterOpinion={opinions[0].percentage}
						percentageOppositeOpinion={opinions[1].percentage}
						countRegisterOpinion={opinions[0].count}
						countOppositeOpinion={opinions[1].count}
						registerColor="#F66C23"
						oppositeColor="#0B68EC"
					/>
				</div>
			)}
			<Opponent
				nickname={oppositeUser.nickname}
				imgUrl={oppositeUser.imgUrl}
				opinion={oppositeUserOpinion}
				speechBubbleColor={speechBubbleColor}
			/>
		</StyledOpponents>
	);
}

ModalContent.defaultProps = {
	preResult: {
		percentageRegisterOpinion: 50,
		percentageOppositeOpinion: 50,
	},
	finalResult: {
		percentageRegisterOpinion: 50,
		percentageOppositeOpinion: 50,
	},
};

export default ModalContent;
