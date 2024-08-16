import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import BoardHeader from "@/components/Board/BoardHeader";
import Ticket from "@/components/Board/fanning/Ticket";
import WindIcon from "@/assets/images/Wind.gif";
import PlusButton from "@/components/Board/fanning/PlusButton";
import { TicketType } from "@/types/Board/ticket";
import { categories } from "@/constant/boardCategory";
import { convertToTimeZone } from "@/utils/dateUtils";
import { battleService } from "@/services/battleService";
import { BattleWaitingParticipant } from "@/types/battle";
import { Opinion } from "@/types/vote";
import { useAuthStore } from "@/stores/userAuthStore";
import AlertModal from "@/components/Modal/PrevotingFailModal";

const PreVotingBoardContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 30px 0;
	width: 100%;
`;

const BoardTicketContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 10px;
	width: 100%;
	max-width: 1200px;

	@media (min-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
	}
`;

function PreVotingBoardPage() {
	const [selectedCategory, setSelectedCategory] = useState<string>("전체");
	const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const navigate = useNavigate();
	const { isLogin } = useAuthStore();

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category);
		setPage(0);
		setFilteredTickets([]);
		setHasMore(true);
	};

	const handleVote = async (ticketId: number, opinionIndex: number) => {
		if (!isLogin) {
			toast.error("로그인이 필요합니다", { autoClose: 1000 });
			navigate("/login");
			return;
		}
		try {
			const requestData = {
				battleId: ticketId,
				selectedOpinion: opinionIndex,
			};
			console.log("requestData", requestData);

			const response = await battleService.preVoteToBattle(requestData);
			console.log("사전투표 결과", response);

			if (response.data === -1) {
				setAlertMessage(
					"본인이 참여하는 라이브에는 사전투표를 할 수 없습니다.",
				);
				setShowAlert(true);
				return; // 투표를 중단
			}

			if (response.data === -3) {
				setAlertMessage("모집인원이 마감되어 사전 투표를 실패하였습니다.");
				setShowAlert(true);
				return; // 투표를 중단
			}

			if (response.data === -4) {
				setAlertMessage(
					"해당 시간에 본인이 진행하는 라이브가 존재하여 참여할 수 없습니다.",
				);
				setShowAlert(true);
				return; // 투표를 중단
			}

			const updatedTickets = filteredTickets.map((ticket) => {
				if (ticket.id === ticketId) {
					return {
						...ticket,
						currentPeopleCount: response.data ?? 0,
						isVoted: true,
					};
				}

				return ticket;
			});
			setFilteredTickets(updatedTickets); // 상태 업데이트
		} catch (error) {
			console.error("Failed to submit vote:", error);
		}
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
		const fetchBattles = async () => {
			if (isLoading || !hasMore) return;

			setIsLoading(true);

			try {
				const categoryIndex =
					selectedCategory === "전체"
						? undefined
						: categories.find((category) => category.name === selectedCategory)
								?.id;

				const response = await battleService.getApplyList(
					categoryIndex,
					page,
					5,
				);
				const battles: BattleWaitingParticipant[] = response.data || [];

				const tickets: TicketType[] = battles.map((battle) => ({
					id: battle.id,
					title: battle.title,
					opinions: battle.opinions.map((opinion: Opinion) => ({
						index: opinion.index,
						opinion: opinion.opinion,
					})),
					startDate: convertToTimeZone(battle.startDate, "Asia/Seoul"),
					endDate: convertToTimeZone(battle.endDate, "Asia/Seoul"),
					maxPeopleCount: battle.maxPeopleCount,
					currentPeopleCount: battle.currentPeopleCount,
					isVoted: battle.isVoted,
				}));

				if (tickets.length > 0) {
					setFilteredTickets((prevTickets) => [...prevTickets, ...tickets]);
				} else {
					setHasMore(false);
				}
			} catch (error) {
				console.error("Failed to fetch battles:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBattles();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory, page]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	const getTheme = (index: number) => {
		return index === 1 || index === 2 || (index >= 5 && (index - 1) % 4 < 2)
			? "yellow"
			: "navy";
	};

	return (
		<div>
			<Header />
			<div className="p-10 pt-20">
				<BoardHeader
					boardName="부채질"
					categories={categories}
					selectedCategory={selectedCategory}
					onCategorySelect={handleCategorySelect}
					boardIcon={WindIcon}
				/>
				<PreVotingBoardContainer>
					<BoardTicketContainer>
						{filteredTickets.map((ticket, index) => (
							<Ticket
								key={ticket.id}
								ticket={ticket}
								theme={getTheme(index)}
								onVote={handleVote}
							/>
						))}
					</BoardTicketContainer>
				</PreVotingBoardContainer>
			</div>
			<PlusButton
				strokeColor="#1D3D6B"
				fillColor="#FBCA27"
				defaultForm="live"
			/>
			<AlertModal
				show={showAlert}
				onClose={() => setShowAlert(false)}
				message={alertMessage}
			/>
		</div>
	);
}

export default PreVotingBoardPage;
