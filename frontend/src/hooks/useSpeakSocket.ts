// import { useCallback, useEffect, useState } from "react";
// import { Client } from "@stomp/stompjs";
// import { SpeakRequest, SpeakResponse } from "@/types/liveMessageType";
// import { getSpeackReqeustList } from "@/services/speakReqeustService";

// const useSpeakSocket = (stompClient: Client, battleId: string) => {
// 	const [speakRequests, setSpeakRequests] = useState<SpeakResponse[]>([]);

// 	useEffect(() => {
// 		const fetchRequests = async () => {
// 			try {
// 				const response = await getSpeackReqeustList(battleId!);
// 				setSpeakRequests(response.data!);
// 			} catch (error) {
// 				console.error("Failed to load notifications:", error);
// 			}
// 		};

// 		fetchRequests();
// 	}, [battleId]);

// 	// 발언권 요청 응답 처리
// 	const handleSpeak = useCallback((data: SpeakResponse) => {
// 		setSpeakRequests((prevRequests) => [...prevRequests, data]);
// 	}, []);

// 	// 발언권 요청 전송
// 	const sendSpeak = useCallback(
// 		(userId: number, connectionId: string) => {
// 			if (stompClient && stompClient.connected) {
// 				const request: SpeakRequest = {
// 					type: "speak",
// 					data: { userId, connectionId },
// 				};
// 				stompClient.publish({
// 					destination: `/app/live/${battleId}`,
// 					body: JSON.stringify(request),
// 				});
// 				console.log("Speak 요청 전송됨:", request);
// 			} else {
// 				console.error(
// 					"요청을 보낼 수 없습니다: STOMP 클라이언트가 연결되지 않았습니다.",
// 				);
// 			}
// 		},
// 		[stompClient, battleId],
// 	);

// 	return { speakRequests, handleSpeak, sendSpeak };
// };

// export default useSpeakSocket;
