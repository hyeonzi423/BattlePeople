import { useRef, useCallback, useState, useEffect } from "react";
import {
	Connection,
	OpenVidu,
	Publisher,
	Session,
	StreamEvent,
	StreamManager,
} from "openvidu-browser";
import { getTokenAndIndex } from "@/services/openviduService";
import { ServerData } from "@/types/openvidu";

const useOpenVidu = () => {
	const OV = useRef<OpenVidu>();
	const session = useRef<Session>();
	const [publisher, setPublisher] = useState<Publisher>();
	const [isPublisher, setIsPublisher] = useState<boolean>(false);
	const [shouldPublish, setShoudPublish] = useState<boolean>(false);
	const [subscribers, setSubscribers] = useState<StreamManager[]>([]);
	const [index, setIndex] = useState<number>(-1);
	const publisherRole = useRef<"SUPPORTER" | "SPEAKER">();
	const reconnectBattleId = useRef<string>();
	const connectionId = useRef<string>();
	let joinSession: (battleId: string) => Promise<void>;

	const leaveSession = useCallback(() => {
		if (session.current) {
			session.current?.disconnect();
			session.current = undefined;
		}
		publisherRole.current = undefined;
		connectionId.current = undefined;
		setPublisher(undefined);
		setIndex(-1);
		setSubscribers([]);
		setIsPublisher(false);
		setShoudPublish(false);
		OV.current = undefined;
		reconnectBattleId.current = undefined;
	}, []);

	useEffect(() => {
		return () => leaveSession();
	}, [leaveSession]);

	const initializeSession = async (battleId: string) => {
		const tokenResponse = await getTokenAndIndex(battleId);

		if (!tokenResponse.data) {
			throw new Error("Invalid response data");
		}

		return tokenResponse.data;
	};

	const parseServerData = (connection: Connection) => {
		const serverData: ServerData = JSON.parse(
			connection.data.split("%/%").at(-1)!,
		);
		// eslint-disable-next-line no-param-reassign
		connection.serverData = serverData;
		return serverData;
	};

	const onSupporterPublish = useCallback((serverData: ServerData) => {
		const diffMs = new Date(serverData.tokenEndDate!).getTime() - Date.now();

		if (publisher) {
			setTimeout(() => {
				leaveSession();
				joinSession(reconnectBattleId.current!);
			}, diffMs + 100);
			return;
		}

		const shouldUnpublish =
			publisherRole.current === "SPEAKER" && serverData.index === index;
		if (shouldUnpublish) {
			setShoudPublish(false);
			setTimeout(() => setShoudPublish(true), diffMs + 100);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onStreamCreated = useCallback(
		(event: StreamEvent, publisher?: Publisher) => {
			console.log("STREAM CREATED");
			const serverData = parseServerData(event.stream.connection);

			if (publisher) {
				setSubscribers((prevSubscribers) => {
					return [...prevSubscribers, publisher];
				});
			} else {
				const subscriber = session.current!.subscribe(
					event.stream,
					undefined,
					(error: Error | undefined) => {
						if (error) {
							console.error("ERROR", error);
						} else {
							setTimeout(() => {
								setSubscribers((prevSubscribers) => {
									return [...prevSubscribers, subscriber];
								});
							}, 100);
						}
					},
				);
			}

			if (serverData.role === "SUPPORTER") onSupporterPublish(serverData);
		},
		[onSupporterPublish],
	);

	const onStreamDestroyed = (event: StreamEvent) => {
		console.log("STREAM DESTROYED");
		setSubscribers((prevSubscribers) =>
			prevSubscribers.filter(
				(subscriber) => subscriber.stream !== event.stream,
			),
		);
	};

	joinSession = useCallback(
		async (battleId: string) => {
			reconnectBattleId.current = battleId;
			OV.current = new OpenVidu();

			const { token, index } = await initializeSession(battleId);
			setIndex(index);

			if (!token) return;

			session.current = OV.current.initSession();

			// 상대방의 스트림을 구독
			session.current.on("streamCreated", onStreamCreated);
			session.current.on("streamDestroyed", onStreamDestroyed);

			await session.current.connect(token);
			const isPublisher = session.current.capabilities.publish;
			connectionId.current = session.current.connection.connectionId;
			setIsPublisher(isPublisher);
			setShoudPublish(isPublisher);
			if (isPublisher) {
				parseServerData(session.current.connection);
				publisherRole.current = session.current.connection.serverData?.role;
			}
		},
		[onStreamCreated],
	);

	const publishMedia = async (
		videoSource?: MediaStreamTrack,
		audioSource?: MediaStreamTrack,
		publishAudio: boolean = true,
		publishVideo: boolean = true,
		frameRate: number = 30,
	) => {
		if (session.current?.capabilities.publish) {
			const pub = OV.current!.initPublisher(undefined, {
				audioSource,
				videoSource,
				publishAudio,
				publishVideo,
				resolution: "480x240",
				frameRate,
			});
			pub.on("streamCreated", (event) => onStreamCreated(event, pub));
			pub.on("streamDestroyed", onStreamDestroyed);
			setPublisher(pub);
			session.current.publish(pub);
		}
	};

	const unpublishMedia = () => {
		return publisher ? session.current?.unpublish(publisher) : undefined;
	};

	return {
		joinSession,
		publishMedia,
		unpublishMedia,
		session,
		connectionId,
		publisher,
		subscribers,
		index,
		isPublisher,
		shouldPublish,
	};
};

export default useOpenVidu;
