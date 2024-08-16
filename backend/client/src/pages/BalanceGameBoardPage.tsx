import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/header";
import BoardHeader from "@/components/Board/BoardHeader";
import PlusButton from "@/components/Board/fanning/PlusButton";
import BalanceGameCard from "@/components/Board/bonfire/BalanceGameCard";
import { categories } from "@/constant/boardCategory";
import { LiveStatus } from "@/types/Board/liveStatus";
import { balanceGameService } from "@/services/balanceGameService";
import {
	BalanceGameCardType,
	OpinionType,
} from "@/types/Board/balancegameCard";
import { ApiResponse, BalanceGameResponse } from "@/types/api";
import bonfireIcon from "@/assets/images/bonfire.gif";
import { useAuthStore } from "@/stores/userAuthStore";

const BalanceGameBoardContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
`;

const BoardCardContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 10px;
	width: 100%;
	max-width: 1050px;
	padding: 0 10px;

	@media (min-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
	}
`;

function BalanceGameBoardPage() {
	const [selectedCategory, setSelectedCategory] = useState<string>("전체");
	const [selectedStatus, setSelectedStatus] = useState<LiveStatus>("live");
	const [filteredCards, setFilteredCards] = useState<BalanceGameCardType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const navigate = useNavigate();
	const { isLogin, user } = useAuthStore();

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
		const fetchBalanceGames = async () => {
			if (isLoading || !hasMore) return;

			setIsLoading(true);

			try {
				const categoryIndex =
					selectedCategory === "전체"
						? undefined
						: categories.find((category) => category.name === selectedCategory)
								?.id;

				const status = selectedStatus === "live" ? 5 : 6;

				const response: ApiResponse<BalanceGameResponse[]> =
					await balanceGameService.getBalanceGames(
						categoryIndex,
						status,
						page,
						7,
					);

				const balanceGames: BalanceGameCardType[] =
					response.data?.map((game) => {
						if (game.id === undefined) {
							throw new Error("Invalid data: id is undefined");
						}

						return {
							id: game.id,
							title: game.title,
							opinions: game.opinions,
							currentState: game.currentState,
							startDate: game.startDate,
							endDate: game.endDate,
							category: game.category,
							userVote: game.userVote ?? null,
						};
					}) || [];

				if (balanceGames.length > 0) {
					setFilteredCards((prevCards) => [...prevCards, ...balanceGames]);
				} else {
					setHasMore(false);
				}
			} catch (error) {
				console.error("Failed to fetch balance games:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBalanceGames();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory, selectedStatus, page]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	const handleVote = async (cardId: number, updatedOpinions: OpinionType[]) => {
		if (!isLogin) {
			toast.error("로그인이 필요합니다", { autoClose: 1000 });
			navigate("/login");
			return;
		}
		console.log("유저 아이디", user);

		try {
			const selectedOption = updatedOpinions[0]?.index; // 첫 번째 선택된 옵션의 인덱스를 가져옴

			if (selectedOption === undefined) {
				console.error("Invalid opinion selection");
				return;
			}

			// 여기서 실제로 서버에 의견을 제출하는 로직이 들어갑니다.
			const response = await balanceGameService.voteBalanceGame(
				cardId,
				selectedOption,
			);
			console.log("응답 데이터:", response);

			if (response.data && response.data.opinions) {
				const updatedOpinions = response.data.opinions;

				// 응답으로 받은 opinions 데이터를 이용해 상태를 업데이트합니다.
				setFilteredCards((prevState) =>
					prevState.map((card) => {
						if (card.id === cardId) {
							return {
								...card,
								opinions: updatedOpinions,
								userVote: selectedOption,
							};
						}
						return card;
					}),
				);
			} else {
				console.error("Unexpected response format:", response);
			}
		} catch (error) {
			console.error("Failed to submit vote:", error);
			// 오류 처리를 필요에 따라 여기에 추가할 수 있습니다.
		}
	};

	return (
		<div>
			<Header />
			<div className="p-10 pt-20">
				<BoardHeader
					boardName="모닥불"
					categories={categories}
					selectedCategory={selectedCategory}
					onCategorySelect={handleCategorySelect}
					selectedStatus={selectedStatus}
					onStatusSelect={handleStatusSelect}
					boardIcon={bonfireIcon}
				/>
				<BalanceGameBoardContainer>
					<BoardCardContainer>
						{filteredCards.map((card) => {
							const isEnded = card.currentState === 6;
							return (
								<BalanceGameCard
									key={card.id}
									data={card}
									onVote={handleVote}
									disabled={selectedStatus === "ended"}
									isEnded={isEnded}
								/>
							);
						})}
					</BoardCardContainer>
				</BalanceGameBoardContainer>
			</div>
			<PlusButton
				strokeColor="#000000"
				fillColor="#F66C23"
				defaultForm="general"
			/>
		</div>
	);
}

export default BalanceGameBoardPage;
