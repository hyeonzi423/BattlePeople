import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { ChatMessage } from "@/types/Chat";

interface UseChatStompReturn {
	messages: ChatMessage[];
	sendMessage: (userId: number, message: string) => void;
}

const useChatSocket = (battleId: string): UseChatStompReturn => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const stompClientRef = useRef<Client | null>(null);

	const addMessage = (message: ChatMessage) => {
		setMessages((prevMessages) => {
			const updatedMessages = [...prevMessages, message];
			return updatedMessages.slice(-40); // 마지막 40개 메시지만 유지
		});
	};

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
				client.subscribe(`/topic/chat/${battleId}`, (message: IMessage) => {
					const parsedMessage: ChatMessage = JSON.parse(message.body);
					addMessage(parsedMessage);
				});
			},
			onStompError: (frame) => {
				console.error("STOMP error", frame);
			},
		});

		client.activate();
		stompClientRef.current = client;

		// 상태 초기화
		return () => {
			setMessages([]);
			if (stompClientRef.current) {
				stompClientRef.current.deactivate();
				stompClientRef.current = null;
			}
		};
	}, [battleId]);

	const sendMessage = (userId: number, message: string) => {
		if (stompClientRef.current && stompClientRef.current.connected) {
			const chatMessage = {
				userId,
				message,
			};
			stompClientRef.current.publish({
				destination: `/app/chat/${battleId}`,
				body: JSON.stringify(chatMessage),
			});
		} else {
			console.error("Unable to send message: STOMP client is not connected.");
		}
	};

	return {
		messages,
		sendMessage,
	};
};

export default useChatSocket;
