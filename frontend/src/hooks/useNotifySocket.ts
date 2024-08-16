import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/userAuthStore";

export const useNotifySocket = () => {
	const clientRef = useRef<Client | null>(null); // client를 ref로 선언
	const isSubscribedRef = useRef(false); // 구독 상태를 ref로 유지
	const { user } = useAuthStore();

	useEffect(() => {
		if (!user) {
			if (clientRef.current) {
				clientRef.current.deactivate();
				clientRef.current = null;
			}
			return;
		}

		if (isSubscribedRef.current) {
			return;
		}

		const socket = new WebSocket(import.meta.env.VITE_APP_WEBSOCKET_URL);
		const client = new Client({
			webSocketFactory: () => socket,
			debug: (str: unknown) => console.log(str),
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: () => {
				console.log("Connected to notify server");

				// 구독 설정
				client.subscribe(`/topic/${user.id}`, (message: IMessage) => {
					console.log(message.body);
					toast.info(`${message.body}`, { autoClose: 2000 });
				});

				isSubscribedRef.current = true; // 구독 상태 업데이트
				clientRef.current = client; // client 인스턴스 저장
			},
			onStompError: (frame: unknown) => {
				console.error("STOMP error", frame);
			},
		});

		client.activate();

		// 컴포넌트 언마운트 시 클린업
		// eslint-disable-next-line consistent-return
		return () => {
			if (clientRef.current) {
				clientRef.current.deactivate();
			}
		};
	}, [user]);
};
