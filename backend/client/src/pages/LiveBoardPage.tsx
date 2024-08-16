import { useState, useEffect, useCallback } from "react";
import Header from "@/components/header";
import BoardHeader from "@/components/Board/BoardHeader";
import LiveCard from "@/components/Board/firework/LiveCard";
import { CardType } from "@/types/Board/liveBoardCard";
import { LiveStatus } from "@/types/Board/liveStatus";
import { categories } from "@/constant/boardCategory";
import { liveBattleService } from "@/services/liveBattleService";
import { LiveBattleCardInfo } from "@/types/live";

function LiveBoardPage() {
	const [selectedCategory, setSelectedCategory] = useState<string>("전체");
	const [selectedStatus, setSelectedStatus] = useState<LiveStatus>("live");
	const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [hasMore, setHasMore] = useState<boolean>(true);

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category);
		setPage(0);
		setFilteredCards([]);
		setHasMore(true);
	};

	const handleStatusSelect = (status: LiveStatus) => {
		if (selectedStatus === status) return;
		setSelectedStatus(status);
		setPage(0);
		setFilteredCards([]);
		setHasMore(true);
	};

	const fetchLiveBattles = async (page: number) => {
		try {
			setIsLoading(true);

			const categoryIndex =
				selectedCategory === "전체"
					? undefined
					: categories.find((category) => category.name === selectedCategory)
							?.id;

			let response;
			switch (selectedStatus) {
				case "live":
					response = await liveBattleService.getActiveList(
						categoryIndex,
						page,
						12,
					);
					break;
				case "upcoming":
					response = await liveBattleService.getWaitList(
						categoryIndex,
						page,
						12,
					);
					break;
				case "ended":
					response = await liveBattleService.getEndList(
						categoryIndex,
						page,
						12,
					);
					break;
				default:
					return;
			}

			const liveBattles: LiveBattleCardInfo[] = response.data || [];

			if (liveBattles.length === 0) {
				setHasMore(false); // No more data to load
				return;
			}

			const cards: CardType[] = liveBattles.map((battle) => ({
				id: battle.id,
				title: battle.title,
				regist_user_id: battle.registerUser.nickname.toString(),
				opposite_user_id: battle.oppositeUser.nickname.toString(),
				start_date: battle.startDate,
				end_date: battle.endDate,
				max_people_count: battle.currentPeopleCount || 0,
				category: battle.category,
				image_uri: battle.imageUri || "",
				live_uri: battle.roomId,
				status: selectedStatus,
				currentPeopleCount: battle.currentPeopleCount || 0,
			}));

			setFilteredCards((prevCards) => [...prevCards, ...cards]);
		} catch (error) {
			console.error("Failed to fetch live battles:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLiveBattles(page);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory, selectedStatus, page]);

	const handleScroll = useCallback(() => {
		if (
			window.innerHeight + document.documentElement.scrollTop + 100 >=
			document.documentElement.scrollHeight
		) {
			if (!isLoading && hasMore) {
				setPage((prevPage) => prevPage + 1);
			}
		}
	}, [hasMore, isLoading]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	return (
		<div>
			<Header />
			<div className="p-10 pt-20">
				<BoardHeader
					boardName="불구경"
					categories={categories}
					selectedCategory={selectedCategory}
					onCategorySelect={handleCategorySelect}
					selectedStatus={selectedStatus}
					onStatusSelect={handleStatusSelect}
				/>
				{isLoading && filteredCards.length === 0 ? (
					<div>Loading...</div>
				) : (
					<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
						{filteredCards.map((card) => (
							<LiveCard key={card.id} card={card} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default LiveBoardPage;
