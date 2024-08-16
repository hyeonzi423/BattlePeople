import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import styled, { keyframes, css } from "styled-components";
import { CardType } from "@/types/Board/liveBoardCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import noImage from "@/assets/images/noImage.png";
import { createLiveStateBorder, CustomCSSProperties } from "@/utils/textBorder";

const SliderContainer = styled.div`
	width: 100%;
	margin-top: 120px;
	position: relative;
	box-sizing: border-box;
	background-color: white;
`;

const StyledSlider = styled(Slider)`
	.slick-prev,
	.slick-next {
		z-index: 1;
		width: 40px;
		height: 40px;
		color: orange;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		&:before {
			font-size: 60px;
			color: black;
		}
	}
	.slick-prev {
		left: 280px;
	}
	.slick-next {
		right: 280px;
	}
	.slick-slide > div {
		margin: 0 10px; /* 슬라이더 사이의 공백 설정 */
		background-color: white;
		height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
		width: 80%; /* 슬라이더의 가로 길이를 줄임 */
		margin: 0 auto;
	}
`;

const ImageContainer = styled.div`
	max-width: 100%;
	height: 400px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border-radius: 19px;
	border: 6px solid black;
	cursor: pointer;
	box-sizing: border-box;
	background-color: white;
`;

const StyledImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
`;

const slideUp = keyframes`
	from {
		transform: translateY(20px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
`;

const TextOverlay = styled.div<{ animate: boolean }>`
	position: absolute;
	bottom: 20px;
	left: 20px;
	z-index: 2;
	color: white;
	padding: 10px;
	border-radius: 5px;
	max-width: 80%;
	opacity: 0;
	${({ animate }) =>
		animate &&
		css`
			animation: ${slideUp} 0.9s ease-out;
			opacity: 1;
		`}
`;

const Title = styled.div<CustomCSSProperties>`
	margin: 0;
	font-size: 2em;
	color: white;
	text-shadow: ${({ textShadow }) => textShadow || "none"};
`;

const UserInfo = styled.div<CustomCSSProperties>`
	margin: 5px 0 0;
	font-size: 1.5em;
	line-height: 1.2;
	color: white;
	text-shadow: ${({ textShadow }) => textShadow || "none"};
`;

function LargeCarousel({ cards }: { cards: CardType[] }) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const navigate = useNavigate();
	const liveStateBorder = createLiveStateBorder("#000000", 3);

	const settings = {
		className: "center",
		centerMode: true,
		infinite: true,
		centerPadding: "20%", // 양쪽에 슬라이드가 보이도록 패딩 설정
		slidesToShow: 1,
		speed: 1500,
		autoplay: true,
		autoplaySpeed: 4000,
		afterChange: (index: number) => setCurrentSlide(index),
	};

	const handleSlideClick = (cardId: string) => {
		navigate(`/live/${cardId}`);
	};

	return (
		<SliderContainer>
			<StyledSlider
				className={settings.className}
				centerMode={settings.centerMode}
				infinite={settings.infinite}
				centerPadding={settings.centerPadding}
				slidesToShow={settings.slidesToShow}
				speed={settings.speed}
				autoplay={settings.autoplay}
				autoplaySpeed={settings.autoplaySpeed}
				afterChange={settings.afterChange}
			>
				{cards.map((card, index) => (
					<div key={card.id}>
						<ImageContainer
							onClick={() => handleSlideClick(card.id.toString())}
						>
							<StyledImage src={card.image_uri || noImage} alt={card.title} />
							<TextOverlay animate={currentSlide === index}>
								<Title textShadow={liveStateBorder.textShadow}>
									{card.title}
								</Title>
								<UserInfo textShadow={liveStateBorder.textShadow}>
									{card.regist_user_id} vs {card.opposite_user_id}
								</UserInfo>
							</TextOverlay>
						</ImageContainer>
					</div>
				))}
			</StyledSlider>
		</SliderContainer>
	);
}

export default LargeCarousel;
