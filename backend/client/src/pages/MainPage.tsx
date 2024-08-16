import { useState, useEffect } from "react";
import styled from "styled-components";
import LiveSlickCarousel from "@/components/Main/LiveSlickCarousel";
import Header from "@/components/header";
import { CardType } from "@/types/Board/liveBoardCard";
import { categories } from "@/constant/boardCategory";
import { liveBattleService } from "@/services/liveBattleService";
import LargeCarousel from "@/components/Main/LargeCarousel";
import { useAuthStore } from "@/stores/userAuthStore";
import { authService } from "@/services/userAuthService";

const PageContainer = styled.div`
	padding: 40px;
`;

const CategorySection = styled.div`
	margin-top: 40px;
`;

const SectionHeader = styled.div`
	margin-top: 60px;
	margin-bottom: 20px;
	font-size: 2em;
	text-align: left;
`;

const CategoryTitle = styled.div`
	font-size: 1.8em;
	padding-left: 20px;
`;

const LoadingMessage = styled.div`
	font-size: 1.2em;
	text-align: center;
	padding: 20px;
`;

const InterestPrompt = styled.div`
	font-size: 1.5em;
	text-align: center;
	margin-top: 50px;
	background-color: #eeeeee;
	padding: 10px;
`;

function MainPage() {
	const [largeCarouselCards, setLargeCarouselCards] = useState<CardType[]>([]);
	const [interestedCards, setInterestedCards] = useState<
		Record<number, CardType[]>
	>({});
	const [otherCards, setOtherCards] = useState<Record<number, CardType[]>>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { isLogin } = useAuthStore();
	const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

	useEffect(() => {
		const fetchLiveData = async () => {
			try {
				setIsLoading(true);
				console.log("Fetching live data...");

				const [interestsResponse, carouselResponse, ...cardResponses] =
					await Promise.allSettled([
						isLogin ? authService.getUserInterests() : Promise.reject(),
						liveBattleService.getActiveList(undefined, 0, 5),
						...categories
							.filter((category) => category.id !== 7)
							.map((category) => liveBattleService.getActiveList(category.id)),
					]);

				const interests =
					interestsResponse.status === "fulfilled"
						? interestsResponse.value
						: [];

				const largeCarouselCards =
					carouselResponse.status === "fulfilled" &&
					carouselResponse.value.code === "success"
						? carouselResponse.value.data!.map((battle) => ({
								id: battle.id,
								title: battle.title,
								regist_user_id: battle.registerUser.nickname.toString(),
								opposite_user_id: battle.oppositeUser.nickname.toString(),
								start_date: battle.startDate,
								end_date: battle.endDate,
								max_people_count: battle.currentPeopleCount || 0,
								currentPeopleCount: battle.currentPeopleCount || 0,
								category: battle.category,
								image_uri: battle.imageUri || "",
								live_uri: battle.roomId,
								status: "live",
							}))
						: [];

				const cardResults = cardResponses.map((cardResponse, index) => {
					const liveBattles =
						cardResponse.status === "fulfilled" &&
						cardResponse.value.code === "success"
							? cardResponse.value.data || []
							: [];

					const cards: CardType[] = liveBattles.map((battle) => ({
						id: battle.id,
						title: battle.title,
						regist_user_id: battle.registerUser.nickname.toString(),
						opposite_user_id: battle.oppositeUser.id.toString(),
						start_date: battle.startDate,
						end_date: battle.endDate,
						max_people_count: battle.currentPeopleCount || 0,
						currentPeopleCount: battle.currentPeopleCount || 0,
						category: battle.category,
						image_uri: battle.imageUri || "",
						live_uri: battle.roomId,
						status: "live",
					}));

					return {
						categoryId: categories
							.filter((category) => category.id !== 7)
							.at(index)!.id,
						cards,
					};
				});

				const interested: Record<number, CardType[]> = {};
				const others: Record<number, CardType[]> = {};

				cardResults.forEach(({ categoryId, cards }) => {
					if (interests.includes(categoryId)) {
						interested[categoryId] = cards;
					} else {
						others[categoryId] = cards;
					}
				});

				if (interests.length) setSelectedInterests(interests);
				setLargeCarouselCards(largeCarouselCards);
				setInterestedCards(interested);
				setOtherCards(others);

				console.log("Large Carousel Cards:", largeCarouselCards);
				console.log("Interested Cards:", interested);
				console.log("Other Cards:", others);
			} catch (error) {
				console.error("Failed to fetch live battles:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLiveData(); // Fetch data for all scenarios
	}, [isLogin]);

	if (isLoading) {
		return <LoadingMessage>Loading...</LoadingMessage>;
	}

	return (
		<div>
			<Header />
			{/* {largeCarouselCards.length >= 3 && (
				<LargeCarousel cards={largeCarouselCards} />
			)} */}
			<LargeCarousel cards={largeCarouselCards} />
			<PageContainer>
				{!isLogin && (
					<>
						<SectionHeader>🔍 전체 카테고리 탐색하기</SectionHeader>
						{Object.keys(otherCards).map((categoryId) => (
							<CategorySection key={categoryId}>
								<CategoryTitle>
									#
									{
										categories.find(
											(cat) => cat.id === parseInt(categoryId, 10),
										)?.name
									}
								</CategoryTitle>
								<LiveSlickCarousel
									cards={otherCards[parseInt(categoryId, 10)]}
									key={categoryId}
								/>
							</CategorySection>
						))}
					</>
				)}
				{isLogin && selectedInterests.length === 0 && (
					<>
						<InterestPrompt>
							📢 마이페이지에서 관심사를 등록해보세요! 관심사에 맞는 라이브
							방송을 먼저 보여드릴게요.
						</InterestPrompt>
						<SectionHeader>🔍 전체 카테고리 탐색하기</SectionHeader>
						{Object.keys(otherCards).map((categoryId) => (
							<CategorySection key={categoryId}>
								<CategoryTitle>
									#
									{
										categories.find(
											(cat) => cat.id === parseInt(categoryId, 10),
										)?.name
									}
								</CategoryTitle>
								<LiveSlickCarousel
									cards={otherCards[parseInt(categoryId, 10)]}
									key={categoryId}
								/>
							</CategorySection>
						))}
					</>
				)}
				{isLogin && selectedInterests.length > 0 && (
					<>
						<SectionHeader>💘 회원님의 관심사에 맞춘 라이브 방송</SectionHeader>
						{Object.keys(interestedCards).map((categoryId) => (
							<CategorySection key={categoryId}>
								<CategoryTitle>
									#
									{
										categories.find(
											(cat) => cat.id === parseInt(categoryId, 10),
										)?.name
									}
								</CategoryTitle>
								<LiveSlickCarousel
									cards={interestedCards[parseInt(categoryId, 10)]}
									key={categoryId}
								/>
							</CategorySection>
						))}
						<SectionHeader>🔍 다른 카테고리 탐색하기</SectionHeader>
						{Object.keys(otherCards).map((categoryId) => (
							<CategorySection key={categoryId}>
								<CategoryTitle>
									#
									{
										categories.find(
											(cat) => cat.id === parseInt(categoryId, 10),
										)?.name
									}
								</CategoryTitle>
								<LiveSlickCarousel
									cards={otherCards[parseInt(categoryId, 10)]}
									key={categoryId}
								/>
							</CategorySection>
						))}
					</>
				)}
			</PageContainer>
		</div>
	);
}

export default MainPage;
