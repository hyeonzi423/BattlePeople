import {
	VoteColumn as StyledVoteColumn,
	ProgressBarContainer,
	ProgressBar,
	VoteRow,
	VoteText,
} from "@/assets/styles/modalStyles";

interface VoteResultBarProps {
	title: string;
	percentageRegisterOpinion: number;
	percentageOppositeOpinion: number;
	countRegisterOpinion?: number;
	countOppositeOpinion?: number;
	registerColor: string;
	oppositeColor: string;
}

function VoteResultBar({
	title,
	percentageRegisterOpinion,
	percentageOppositeOpinion,
	countRegisterOpinion = 0,
	countOppositeOpinion = 0,
	registerColor,
	oppositeColor,
}: VoteResultBarProps) {
	return (
		<StyledVoteColumn style={{ width: "100%" }}>
			<VoteText>{title}</VoteText>
			<ProgressBarContainer>
				<ProgressBar
					percentage={percentageRegisterOpinion}
					color={registerColor}
				/>
				<ProgressBar
					percentage={percentageOppositeOpinion}
					color={oppositeColor}
					style={{ left: `${percentageRegisterOpinion}%` }}
				/>
			</ProgressBarContainer>
			<VoteRow>
				<VoteText>
					{percentageRegisterOpinion}%({countRegisterOpinion}명)
				</VoteText>
				<VoteText>
					{percentageOppositeOpinion}%({countOppositeOpinion}명)
				</VoteText>
			</VoteRow>
		</StyledVoteColumn>
	);
}

export default VoteResultBar;
