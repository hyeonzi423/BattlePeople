import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { liveBattleService } from "@/services/liveBattleService";
import { LiveBattleCardInfo } from "@/types/live";
import { createLiveStateBorder, CustomCSSProperties } from "@/utils/textBorder";
import { categories } from "@/constant/boardCategory";
import noImage from "@/assets/images/noImage.png";

const CarouselContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 650px;
	height: 300px;
	background-color: black;
	border-radius: 25px;
	border: 10px solid black;
	outline: none;
`;

const CarouselNintendo = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	overflow-y: hidden;
	position: relative;
`;

const CarouselButtonLeft = styled.div`
	width: 100px;
	height: 100%;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	background-color: #04b9ce;
	border-radius: 15px 0 0 15px;
	padding-top: 30px;
`;

const CarouselButtonRight = styled.div`
	width: 100px;
	height: 100%;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	background-color: #eb5545;
	border-radius: 0 15px 15px 0;
	padding-bottom: 30px;
`;

const ControllerButton = styled.button`
	cursor: pointer;
	transition: all 0.15s;
	background-color: #303030;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 100%;
	border-bottom-width: 4px;
	border-color: #000000;
	border-style: solid;
	font-weight: bold;
	font-size: 1.5rem;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

	&:hover {
		filter: brightness(110%);
		transform: translateY(-1px);
		border-bottom-width: 6px;
	}

	&:active {
		filter: brightness(90%);
		transform: translateY(2px);
		border-bottom-width: 2px;
	}
`;

const CarouselArrow = styled.button`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 0;
	height: 0;
	border-style: solid;
	cursor: pointer;
	outline: none;
	z-index: 10;
`;

const CarouselArrowLeft = styled(CarouselArrow)`
	left: -90px;
	border-width: 30px 45px 30px 0;
	border-color: transparent #000000 transparent transparent;
`;

const CarouselArrowRight = styled(CarouselArrow)`
	right: -90px;
	border-width: 30px 0 30px 45px;
	border-color: transparent transparent transparent #000000;
`;

const CarouselContent = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	color: white;
	font-size: 1.5rem;
	font-weight: bold;
	cursor: pointer; /* Ensure pointer indicates clickable area */
`;

const CarouselBorder = styled.div`
	width: 8px;
	height: 100%;
	background-color: black;
`;

const ContentOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: start;
	padding: 10px;
	pointer-events: none;
	align-items: flex-start;
`;

const LiveBadge = styled.div`
	background-color: red;
	color: white;
	padding: 5px 10px;
	border-radius: 5px;
	font-size: 0.9rem;
	font-weight: bold;
	margin-top: 10px;
	margin-left: 5px;
`;

const ImageTitle = styled.div<CustomCSSProperties>`
	color: white;
	padding: 5px;
	border-radius: 5px;
	font-size: 1.7rem;
	text-shadow: ${({ textShadow }) => textShadow || "none"};
	margin-left: 5px;
`;

function Carousel({ selectedCategory }: { selectedCategory: string }) {
	const [images, setImages] = useState<string[]>([]);
	const [titles, setTitles] = useState<string[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [liveBattles, setLiveBattles] = useState<LiveBattleCardInfo[]>([]); // 추가

	const navigate = useNavigate(); // Initialize navigate

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const categoryIndex =
					selectedCategory === "전체"
						? undefined
						: categories.find((category) => category.name === selectedCategory)
								?.id;

				const response = await liveBattleService.getActiveList(
					categoryIndex,
					0,
					5,
				);

				const liveBattles: LiveBattleCardInfo[] = response.data || [];
				const imageList = liveBattles
					.map((battle) => battle.imageUri || noImage)
					.filter(Boolean);
				const titleList = liveBattles.map((battle) => battle.title);

				setImages(imageList);
				setTitles(titleList);
				setLiveBattles(liveBattles); // 추가
			} catch (error) {
				console.error("Failed to fetch carousel images:", error);
			}
		};

		fetchImages();
	}, [selectedCategory]); // Fetch images whenever the selected category changes

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const prevSlide = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + images.length) % images.length,
		);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === "ArrowLeft") {
			prevSlide();
		} else if (event.key === "ArrowRight") {
			nextSlide();
		}
	};

	const handleNavigation = () => {
		const selectedBattle = liveBattles[currentIndex]; // 선택된 배틀 정보 가져오기
		if (selectedBattle) {
			navigate(`/live/${selectedBattle.id}`, {
				state: { ...selectedBattle },
			});
		}
	};

	const liveStateBorder = createLiveStateBorder("#000000", 3);

	return (
		<CarouselContainer tabIndex={0} role="region" aria-label="Image Carousel">
			<CarouselArrowLeft
				onClick={prevSlide}
				onKeyDown={handleKeyDown}
				aria-label="Previous Slide"
				type="button"
			/>
			<CarouselNintendo>
				<CarouselButtonLeft onClick={handleNavigation}>
					<ControllerButton>
						<span>M</span>
					</ControllerButton>
				</CarouselButtonLeft>
				<CarouselBorder />
				<CarouselContent onClick={handleNavigation}>
					{images.length > 0 ? (
						<>
							<img
								src={images[currentIndex] || noImage}
								alt={`Slide ${currentIndex + 1}`}
								style={{ width: "600px", height: "300px", objectFit: "cover" }}
							/>
							<ContentOverlay>
								<LiveBadge>라이브</LiveBadge>
								<ImageTitle textShadow={liveStateBorder.textShadow}>
									{titles[currentIndex]}
								</ImageTitle>
							</ContentOverlay>
						</>
					) : (
						<div>No Images Available</div>
					)}
				</CarouselContent>
				<CarouselBorder />
				<CarouselButtonRight onClick={handleNavigation}>
					<ControllerButton>
						<span>A</span>
					</ControllerButton>
				</CarouselButtonRight>
			</CarouselNintendo>
			<CarouselArrowRight
				onClick={nextSlide}
				onKeyDown={handleKeyDown}
				aria-label="Next Slide"
				type="button"
			/>
		</CarouselContainer>
	);
}

export default Carousel;
