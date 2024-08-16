import { useEffect, useState } from "react";
import styled from "styled-components";
import "@/assets/styles/scrollbar.css";
import { authService } from "@/services/userAuthService";
import { convertToTimeZone } from "@/utils/dateUtils";
import empty from "@/assets/images/empty.png";

const VotesContainer = styled.div`
	width: 100%;
	height: 300px;
	padding: 20px;
	overflow-y: auto;
`;

const VotesList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`;

const VotesListItem = styled.li`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 30px;
	border: 3px solid #e0e0e0;
	padding: 5px 20px;
	margin-bottom: 10px;
	font-size: 16px;
`;

const VoteDate = styled.span`
	font-size: 14px;
	color: #333;
`;

// const VoteStatusIndicator = styled.span<{ statusColor: string }>`
// 	width: 20px;
// 	height: 20px;
// 	border-radius: 50%;
// 	background-color: ${({ statusColor }) => statusColor};
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

const StatusText = styled.span`
	font-size: 14px;
	color: #333;
`;

interface Vote {
	id: number;
	title: string;
	date: string;
	detail: string;
	statusColor: string;
	statusText: string;
}

function ParticipatedVotesList() {
	const [votes, setVotes] = useState<Vote[]>([]);
	const [, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchVotes = async () => {
			try {
				const data = await authService.getUserVotes(); // API 호출
				const formattedVotes = data.map((vote) => {
					const formattedDate = convertToTimeZone(
						vote.registDate,
						"Asia/Seoul",
					);

					const dateOnly = formattedDate.split(" ")[0]; // 'YYYY-MM-DD'

					return {
						id: vote.id,
						title: vote.title,
						date: `${dateOnly}`, // 날짜를 로컬 형식으로 변환
						detail: vote.detail,
						statusColor: vote.isWin ? "#BDE3FF" : "#FFC7C2", // 승리 여부에 따른 색상 설정
						statusText: vote.isWin ? "승" : "패", // 승리 여부에 따른 텍스트 설정
					};
				});
				setVotes(formattedVotes);
			} catch (err) {
				setError("Failed to fetch user votes.");
			} finally {
				setLoading(false);
			}
		};

		fetchVotes();
	}, []);

	if (error || votes.length === 0) {
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

	return (
		<VotesContainer className="custom-scrollbar">
			<VotesList>
				{votes.map((vote) => (
					<VotesListItem key={vote.id}>
						<TitleContainer>{vote.title}</TitleContainer>
						<DateStatusContainer>
							<VoteDate>{vote.date}</VoteDate>
							<StatusText>{vote.statusText}</StatusText>
							{/* <VoteStatusIndicator statusColor={vote.statusColor} /> */}
						</DateStatusContainer>
					</VotesListItem>
				))}
			</VotesList>
			{/* {selectedVote && (
				<ParticipatedVotesModal
					voteId={selectedVote.id}
					title={selectedVote.title}
					registDate={selectedVote.date}
					detail={selectedVote.detail}
					onClose={() => setSelectedVote(null)} // 모달 닫기
				/>
			)} */}
		</VotesContainer>
	);
}

export default ParticipatedVotesList;
