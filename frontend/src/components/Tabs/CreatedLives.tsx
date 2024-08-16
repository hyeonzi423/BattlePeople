import { useEffect, useState } from "react";
import styled from "styled-components";
import "@/assets/styles/scrollbar.css";
import { authService } from "@/services/userAuthService";
import { convertToTimeZone } from "@/utils/dateUtils";
import empty from "@/assets/images/empty.png";

const CreatedLivesContainer = styled.div`
	width: 100%;
	height: 300px;
	padding: 20px;
	overflow-y: auto;
`;

const CreatedLivesList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`;

const CreatedLivesListItem = styled.li`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 30px;
	border: 3px solid #e0e0e0;
	padding: 5px 20px;
	margin-bottom: 10px;
	font-size: 16px;
`;

const Date = styled.span`
	font-size: 14px;
	color: #333;
`;

const StatusText = styled.span`
	font-size: 14px;
`;

// color: ${({ statusColor }) => statusColor}; /* 상태에 따라 텍스트 색상 설정 */
// const StatusCircle = styled.span<{ statusColor: string }>`
// 	width: 20px;
// 	height: 20px;
// 	border-radius: 50%;
// 	background: ${({ statusColor }) => statusColor};
// `;

const TitleContainer = styled.div`
	flex-grow: 1;
	text-align: left;
`;

const DateStatusContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px; /* 날짜와 상태 아이콘 사이의 간격 */
`;

interface CreatedLive {
	battleBoardId: number;
	title: string;
	date: string;
	statusText: string;
}

function CreatedLives() {
	const [lives, setLives] = useState<CreatedLive[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLives = async () => {
			try {
				const data = await authService.getUserCreatedLives();
				const formattedLives = data.map((live) => {
					const formattedDate = convertToTimeZone(
						live.registDate,
						"Asia/Seoul",
					);

					const dateOnly = formattedDate.split(" ")[0]; // 'YYYY-MM-DD'

					// isWin 값에 따라 상태 색상을 설정
					let statusText;
					if (live.isWin === 0) {
						statusText = "승";
					} else if (live.isWin === 1) {
						statusText = "패";
					} else if (live.isWin === 2) {
						statusText = "무";
					} else if (live.isWin === 4) {
						statusText = "-";
					} else {
						statusText = "";
					}

					return {
						battleBoardId: live.battleBoardId,
						title: live.title,
						date: `${dateOnly}`, // 'YYYY-MM-DD'
						statusText,
					};
				});
				setLives(formattedLives);
			} catch (err) {
				setError("Failed to fetch created lives");
			} finally {
				setLoading(false);
			}
		};

		fetchLives();
	}, []);

	if (error || lives.length === 0) {
		return (
			<div style={{ textAlign: "center", fontSize: "x-large" }}>
				<img
					src={empty}
					alt="Error"
					style={{
						marginLeft: 25,
						marginTop: -30,
						width: "200px",
						height: "200px",
					}}
				/>
				<span>조회된 내역이 없습니다.</span>
			</div>
		);
	}

	// const handleTitleClick = (battleId: number) => {
	// 	setSelectedBattleId(battleId);
	// };

	// const closeModal = () => {
	// 	setSelectedBattleId(null);
	// };

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<CreatedLivesContainer className="custom-scrollbar">
			<CreatedLivesList>
				{lives.map((live) => (
					<CreatedLivesListItem key={live.battleBoardId}>
						<TitleContainer>{live.title}</TitleContainer>
						<DateStatusContainer>
							<Date>{live.date}</Date>
							{/* <StatusCircle statusText={live.statusText} /> */}
							<StatusText>{live.statusText}</StatusText>
						</DateStatusContainer>
					</CreatedLivesListItem>
				))}
			</CreatedLivesList>

			{/* {selectedBattleId !== null && (
				<EndedLivePreviewModal
					battleId={selectedBattleId}
					onClose={closeModal}
				/>
			)} */}
		</CreatedLivesContainer>
	);
}

export default CreatedLives;
