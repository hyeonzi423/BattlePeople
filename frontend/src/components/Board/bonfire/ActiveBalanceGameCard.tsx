import {
	OptionWrapper,
	OptionButton,
	OptionText,
} from "@/assets/styles/balanceGameStyle";

interface ActiveBalanceGameCardProps {
	opinions: Array<{ index: number; opinion: string; percentage: number }>;
	onVote: (index: number) => void;
}

function ActiveBalanceGameCard({
	opinions,
	onVote,
}: ActiveBalanceGameCardProps) {
	return (
		<>
			{opinions.map((opinion, index) => (
				<OptionWrapper
					key={opinion.index}
					onClick={() => onVote(index)}
					disabled={false}
				>
					<OptionButton bgColor={index === 0 ? "#F66C23" : "#0B68EC"}>
						{index === 0 ? "A" : "B"}
					</OptionButton>
					<OptionText
						borderColor={index === 0 ? "#F66C23" : "#0B68EC"}
						bgColor="transparent"
						width={0}
					>
						{opinion.opinion}
					</OptionText>
				</OptionWrapper>
			))}
		</>
	);
}

export default ActiveBalanceGameCard;
