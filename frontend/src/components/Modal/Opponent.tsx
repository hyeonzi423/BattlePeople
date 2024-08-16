import styled from "styled-components";
import {
	Opponent as StyledOpponent,
	OpponentImage,
	SpeechBubble,
	InfoTextSpan,
} from "@/assets/styles/modalStyles";
import defaultUserImage from "@/assets/images/default.png";

interface OpponentProps {
	nickname: string;
	imgUrl: string;
	opinion: string;
	speechBubbleColor: string;
}

const CustomSpeechBubble = styled(SpeechBubble)<{ color: string }>`
	background: ${({ color }) => color};

	&:after {
		border-top-color: ${({ color }) => color};
	}
`;

function Opponent({
	nickname,
	imgUrl,
	opinion,
	speechBubbleColor,
}: OpponentProps) {
	// Handle image error and fallback to default image
	const handleImageError = (
		e: React.SyntheticEvent<HTMLImageElement, Event>,
	) => {
		e.currentTarget.src = defaultUserImage;
	};

	return (
		<StyledOpponent>
			<CustomSpeechBubble color={speechBubbleColor}>
				{opinion}
			</CustomSpeechBubble>
			<OpponentImage
				src={imgUrl}
				alt={nickname}
				borderColor={speechBubbleColor}
				onError={handleImageError}
			/>
			<InfoTextSpan>{nickname}</InfoTextSpan>
		</StyledOpponent>
	);
}

export default Opponent;
