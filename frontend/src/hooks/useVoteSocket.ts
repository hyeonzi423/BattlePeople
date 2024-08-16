import { useCallback, useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { VoteRequest } from "@/types/liveMessageType";
import { OpinionWithPercentage, VoteInfoResponse } from "@/types/vote";
import { getVoteInfo } from "@/services/liveUserService";

const useVoteSocket = (stompClient: Client, battleId: string) => {
	const [voteState, setVoteState] = useState<VoteInfoResponse>({
		totalCount: 0,
		opinions: [
			{ index: 0, opinion: "", count: 0, percentage: 50 },
			{ index: 1, opinion: "", count: 0, percentage: 50 },
		],
		userVoteOpinion: -1,
	});
	const [choice, setChoice] = useState(-1);

	// 초기값 설정
	useEffect(() => {
		const fetchInitialVoteInfo = async () => {
			try {
				const response = await getVoteInfo(battleId);
				if (response.code === "success" && response.data) {
					setVoteState(response.data);
					setChoice(response.data.userVoteOpinion);
				} else {
					console.error("Failed to fetch vote info:", response.msg);
				}
			} catch (error) {
				console.error("Error fetching vote info:", error);
			}
		};

		fetchInitialVoteInfo();
	}, [battleId]);

	// 투표 응답 처리
	const handleVote = useCallback((data: OpinionWithPercentage[]) => {
		setVoteState((prevState) => ({
			...prevState,
			opinions: data,
		}));
	}, []);

	// 투표 요청 전송
	const sendVote = useCallback(
		(userId: number, voteInfoIndex: number) => {
			if (stompClient && stompClient.connected) {
				const request: VoteRequest = {
					type: "vote",
					data: { userId, voteInfoIndex },
				};
				stompClient.publish({
					destination: `/app/live/${battleId}`,
					body: JSON.stringify(request),
				});
				console.log("Vote 요청 전송됨:", request);
			} else {
				console.error(
					"요청을 보낼 수 없습니다: STOMP 클라이언트가 연결되지 않았습니다.",
				);
			}
		},
		[stompClient, battleId],
	);

	return { choice, setChoice, voteState, handleVote, sendVote };
};

export default useVoteSocket;
