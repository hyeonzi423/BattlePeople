import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ItemBox from "@/components/Live/ItemBox";
import VideoScreen from "@/components/Live/VideoScreen";
import Header from "@/components/header";
import Timer from "@/components/Live/Timer";
import LiveVote from "@/components/Live/LiveVote";
import ChatBox from "@/components/Live/ChatBox";
import EndedLive from "@/components/Live/EndLive";

import useWebRTC from "@/hooks/useWebRTC";
import useChatSocket from "@/hooks/useChatSocket";
import useLiveSocket from "@/hooks/useLiveSocket";
import useRequireAuth from "@/hooks/useRequireAuth";

import { WaitingLiveBattleDetail } from "@/types/live";
import { useAuthStore } from "@/stores/userAuthStore";
import { liveBattleService } from "@/services/liveBattleService";

function LivePage() {
	useRequireAuth();
	const navigate = useNavigate();

	const [winner, setWinner] = useState("");
	const [isTimeOver, setIsTimeOver] = useState(false);
	const [isMicMuted, setIsMicMuted] = useState(false);
	const [isVideoDisabled, setIsVideoDisabled] = useState(false);
	const [liveData, setLiveData] = useState<WaitingLiveBattleDetail>();
	// const [userRequestStatus, setUserRequestStatus] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const video = useRef<HTMLVideoElement>(null);
	const canvasForPublish = useRef<HTMLCanvasElement>(null);
	const canvasForMask = useRef<HTMLCanvasElement>(null);
	// connectionId는 발언권 추가 시 import
	const { joinSession, subscribers, index, publisher, setRenderMask } =
		useWebRTC(
			isMicMuted,
			isVideoDisabled,
			video,
			canvasForPublish,
			canvasForMask,
		);

	const userId = useAuthStore().user?.id;
	const { battleId } = useParams();
	const { messages, sendMessage } = useChatSocket(battleId!);
	// const { sendRequestAccept } = useRequestSocket(battleId!, userId!);
	// const { speakRequests, sendSpeak, voteState, sendVote } = useLiveSocket(
	// 	battleId!,
	// );
	const { voteState, sendVote, choice, setChoice } = useLiveSocket(battleId!);

	const handleMicClick = () => {
		setIsMicMuted((prev) => !prev);
	};

	const handleVideoClick = () => {
		setIsVideoDisabled((prev) => {
			setRenderMask(!prev);
			return !prev;
		});
	};

	useEffect(() => {
		joinSession(battleId!);
	}, [battleId, joinSession]);

	useEffect(() => {
		publisher?.publishAudio(!isMicMuted);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMicMuted]);

	useEffect(() => {
		setIsLoading(true);
		const fetchVoteAndRequestData = async () => {
			if (battleId && userId) {
				try {
					// isUserRequest 추가 가능(발언권)
					const [apiData] = await Promise.all([
						liveBattleService.getWaitDetail(battleId!),
						// getIsUserRequest(battleId),
					]);

					if (apiData.code === "fail" || !apiData.data) {
						toast.error("라이브 데이터를 가져오지 못했습니다.");
						navigate("/");
						return;
					}

					setLiveData(apiData.data);
					setIsLoading(false);

					// if (voteOpinion.data === -1) {
					// 	setUserRequestStatus(1);
					// } else {
					// 	setUserRequestStatus(isUserRequest.data!);
					// }
				} catch (error) {
					toast.error("데이터를 가져오는 중 오류가 발생했습니다.");
				}
			}
		};

		fetchVoteAndRequestData();
	}, [battleId, navigate, userId]);

	const onVoteEnd = useCallback((winner: string) => {
		setWinner(winner);
	}, []);

	const handleVote = (userId: number, voteInfoIndex: number) => {
		sendVote(userId, voteInfoIndex);
		// setUserRequestStatus(0);
	};

	// const handleRequestSpeak = (userId: number, connectionId: string) => {
	// 	sendSpeak(userId, connectionId);
	// 	setUserRequestStatus(1);
	// };

	return (
		<>
			<Header />
			<video
				ref={video}
				autoPlay
				muted
				className="fixed invisible w-[640px] h-[480px]"
			>
				<track kind="captions" />
			</video>
			<canvas
				ref={canvasForPublish}
				className="fixed w-[640px] h-[480px] invisible"
			/>
			<canvas
				ref={canvasForMask}
				className="fixed w-[640px] h-[480px] invisible"
			/>
			<div className="flex flex-col">
				<div className="flex-1 flex mt-16 px-8 pt-8">
					{/* 추후에 start와 end시간을 계산해서 duration에 넣기 */}
					{!isLoading && (
						<Timer
							duration={Math.floor(
								(new Date(liveData!.endDate).getTime() - Date.now()) / 1000,
							)}
							onTimeOver={() => setIsTimeOver(true)}
						/>
					)}
					<div className="flex-col w-full justify-center items-center h-144">
						<LiveVote
							choice={choice}
							setChoice={setChoice}
							userId={userId!}
							role={index}
							voteState={voteState}
							title={liveData?.title || ""}
							optionA={liveData?.registerUser.opinion || ""}
							optionB={liveData?.oppositeUser.opinion || ""}
							handleVote={handleVote} // 사용자가 투표하면 handleVote 호출
							onVoteEnd={onVoteEnd}
						/>
						<VideoScreen
							subscribers={subscribers}
							registerUser={liveData?.registerUser}
							oppositeUser={liveData?.oppositeUser}
						/>
						<ItemBox
							isMicMuted={isMicMuted}
							isVideoDisabled={isVideoDisabled}
							canUseItem={
								publisher?.stream.connection.serverData?.role === "SPEAKER" ||
								false
							}
							onMicClick={handleMicClick}
							onVideoClick={handleVideoClick}
							// sendItem={sendItem}
						/>
					</div>
					<div className="flex flex-col h-160 w-1/4 ms-6">
						{/* <SpeakRequestList
							userId={userId!}
							connectionId={connectionId.current}
							speakRequests={speakRequests}
							handleRequestSpeak={handleRequestSpeak}
							sendRequestAccept={sendRequestAccept}
							userRequestStatus={userRequestStatus!}
							role={index}
						/> */}
						<ChatBox
							messages={messages}
							sendMessage={sendMessage}
							userId={userId!}
						/>
					</div>
				</div>
				{isTimeOver && <EndedLive winner={winner} />}
			</div>
		</>
	);
}

export default LivePage;
