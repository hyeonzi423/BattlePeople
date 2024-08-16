import { useCallback, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ItemRequest, ItemResponse } from "@/types/liveMessageType";

const useItemSocket = (stompClient: Client, battleId: string) => {
	const [items, setItems] = useState<ItemResponse[]>([]);

	// 아이템 응답 처리
	const handleItem = useCallback((data: ItemResponse) => {
		setItems((prevItems) => [...prevItems, data]);
	}, []);

	// 아이템 요청 전송
	const sendItem = useCallback(
		(userId: number, targetIndex: number, itemCode: number) => {
			if (stompClient && stompClient.connected) {
				const request: ItemRequest = {
					type: "item",
					data: { userId, targetIndex, itemCode },
				};
				stompClient.publish({
					destination: `/app/live/${battleId}`,
					body: JSON.stringify(request),
				});
				console.log("Item 요청 전송됨:", request);
			} else {
				console.error(
					"요청을 보낼 수 없습니다: STOMP 클라이언트가 연결되지 않았습니다.",
				);
			}
		},
		[stompClient, battleId],
	);

	return { items, handleItem, sendItem };
};

export default useItemSocket;
