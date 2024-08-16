import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LiveCard from "@/components/Board/firework/LiveCard";
import { CardType } from "@/types/Board/liveBoardCard";

const SliderContainer = styled.div`
	margin: 0 auto;
`;

const StyledSlider = styled(Slider)`
	.slick-prev,
	.slick-next {
		z-index: 1;
		width: 40px;
		height: 40px;
		color: black;
		&:before {
			font-size: 40px;
			color: black;
		}
	}

	.slick-slide > div {
		margin: 0 15px; /* 각 슬라이드에 양옆 마진 추가 */
		padding-top: 20px;
	}
`;

interface LiveSlickCarouselProps {
	cards: CardType[];
}

function LiveSlickCarousel({ cards }: LiveSlickCarouselProps) {
	const settings = {
		infinite: false,
		centerPadding: "60px",
		slidesToShow: 4,
		swipeToSlide: true,
		draggable: false,
		afterChange: (index: number) => {
			console.log(
				`Slider Changed to: ${index + 1}, background: #222; color: #bada55`,
			);
		},
	};

	return (
		<SliderContainer>
			<StyledSlider
				infinite={settings.infinite}
				centerPadding={settings.centerPadding}
				slidesToShow={settings.slidesToShow}
				swipeToSlide={settings.swipeToSlide}
				draggable={settings.draggable}
				afterChange={settings.afterChange}
			>
				{cards.map((cardData) => (
					<div key={cardData.id}>
						<LiveCard card={cardData} />
					</div>
				))}
			</StyledSlider>
		</SliderContainer>
	);
}

export default LiveSlickCarousel;
