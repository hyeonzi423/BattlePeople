import VideoStream from "@/components/WebRTC/VideoStream";
import vsImage from "@/assets/images/LiveVS.png";
import { createLiveStateBorder } from "@/utils/textBorder";
import { StreamManager } from "openvidu-browser";
import { UserWithOpinion } from "@/types/live";
import { MutableRefObject, useRef } from "react";
import { Id } from "react-toastify";

const borderStyles = createLiveStateBorder("black", 4);

interface VideoPlayerProps {
	userName: string;
	streamManager?: StreamManager;
	toastId: MutableRefObject<Id | undefined>;
}

function VideoPlayerLeft({
	userName,
	streamManager,
	toastId,
}: VideoPlayerProps) {
	return (
		<div className="w-full h-full flex flex-col items-end">
			<VideoStream
				className={`w-4/5 h-auto aspect-[255/450] mt-5 mb-8 clip-path-left bg-white flex justify-${streamManager ? "end" : "center"} items-center`}
				streamManager={streamManager}
				toastId={toastId}
			/>
			<div
				className="w-full flex flex-col text-white p-2 ps-14 mt-2"
				style={borderStyles}
			>
				<div
					className="font-bold break-normal whitespace-nowrap"
					style={{ fontSize: "clamp(1rem, 3.5vw, 3rem)" }}
				>
					{userName}
				</div>
			</div>
		</div>
	);
}

function VideoPlayerRight({
	userName,
	streamManager,
	toastId,
}: VideoPlayerProps) {
	return (
		<div className="w-full h-full flex flex-col items-start">
			<div
				className="w-full flex flex-col items-end text-white pe-12 mb-4"
				style={borderStyles}
			>
				<div
					className="font-bold break-normal whitespace-nowrap"
					style={{ fontSize: "clamp(1rem, 3.5vw, 3rem)" }}
				>
					{userName}
				</div>
			</div>
			<VideoStream
				className={`w-5/6 h-auto aspect-[255/250] mb-9 mt-6 clip-path-right bg-white flex justify-${streamManager ? "start" : "center"} items-center`}
				streamManager={streamManager}
				toastId={toastId}
			/>
		</div>
	);
}

interface VideoScreenProps {
	subscribers: StreamManager[];
	registerUser?: UserWithOpinion;
	oppositeUser?: UserWithOpinion;
}

function VideoScreen({
	subscribers,
	registerUser,
	oppositeUser,
}: VideoScreenProps) {
	const toastId = useRef<Id>();

	return (
		<div className="relative h-70% w-full">
			<div className="h-full w-full bg-[url('@/assets/images/LivePlayers.png')] bg-contain bg-center bg-no-repeat flex">
				<VideoPlayerLeft
					userName={registerUser?.nickname || "익명A"}
					streamManager={subscribers.find(
						(streamManager) =>
							streamManager.stream.connection.serverData?.index === 0,
					)}
					toastId={toastId}
				/>
				<VideoPlayerRight
					userName={oppositeUser?.nickname || "익명B"}
					streamManager={subscribers.find(
						(streamManager) =>
							streamManager.stream.connection.serverData?.index === 1,
					)}
					toastId={toastId}
				/>
			</div>
			<div className="absolute z-10 w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<img src={vsImage} alt="VS" />
			</div>
		</div>
	);
}

export default VideoScreen;
