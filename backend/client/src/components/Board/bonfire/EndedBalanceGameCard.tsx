import { useEffect, useState } from "react";
import styled from "styled-components";
import {
	OptionWrapper,
	OptionText,
	PercentageLabel,
} from "@/assets/styles/balanceGameStyle";
import like from "@/assets/images/like.png"; // Path to your like GIF

interface Opinion {
	index: number;
	opinion: string;
	percentage: number;
}

interface EndedBalanceGameCardProps {
	opinions: Opinion[];
	userVote?: number | null;
}

const LikeImage = styled.img`
	width: 30px;
	height: 30px;
	margin-right: 8px;
`;

function EndedBalanceGameCard({
	opinions,
	userVote = null,
}: EndedBalanceGameCardProps) {
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimate(true);
		}, 0);

		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			{opinions.map((opinion) => (
				<OptionWrapper key={opinion.index} disabled>
					<PercentageLabel color={opinion.index === 0 ? "#F66C23" : "#0B68EC"}>
						{opinion.percentage}%
					</PercentageLabel>
					<OptionText
						borderColor={opinion.index === 0 ? "#F66C23" : "#0B68EC"}
						bgColor={opinion.index === 0 ? "#F66C23" : "#0B68EC"}
						width={animate ? opinion.percentage : 0}
					>
						{userVote === opinion.index && <LikeImage src={like} alt="Like" />}
						{opinion.opinion}
					</OptionText>
				</OptionWrapper>
			))}
		</>
	);
}

EndedBalanceGameCard.defaultProps = {
	userVote: null,
};

export default EndedBalanceGameCard;
