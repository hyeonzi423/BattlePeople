import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";

const useRequestSocket = (battleId: string, userId: number) => {
	const stompClientRef = useRef<Client | null>(null);

	useEffect(() => {
		const socket = new WebSocket(import.meta.env.VITE_APP_WEBSOCKET_URL);
		const client = new Client({
			webSocketFactory: () => socket,
			debug: (str) => console.log(str),
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: () => {
				console.log("Connected to chat server");

				// 구독 설정
				client.subscribe(
					`/topic/request/${battleId}-${userId}`,
					(message: IMessage) => {
						const parsedMessage = JSON.parse(message.body);
						console.log(parsedMessage);
						//      이런 형식으로 나와야 함
						//     {
						//       "userId": 1,
						//       "token": "tokenidisnkflkl",
						//       "index": 1
						//      }
					},
				);
			},
			onStompError: (frame) => {
				console.error("STOMP error", frame);
			},
		});

		client.activate();
		stompClientRef.current = client;

		// 상태 초기화
		return () => {
			if (stompClientRef.current) {
				stompClientRef.current.deactivate();
				stompClientRef.current = null;
			}
		};
	}, [battleId, userId]);

	// 발언권 승인을 서버에 요청하는 함수
	const sendRequestAccept = (connectionId: string) => {
		const stompClient = stompClientRef.current;
		if (stompClient && stompClient.connected) {
			const request = {
				connectionId,
			};
			stompClient.publish({
				destination: `/app/request/${battleId}-${userId}`,
				body: JSON.stringify(request),
			});
		} else {
			console.error("Unable to send message: STOMP client is not connected.");
		}
	};

	return {
		sendRequestAccept,
	};
};

export default useRequestSocket;
