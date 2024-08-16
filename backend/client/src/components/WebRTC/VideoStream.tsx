import { useRef, useEffect, MutableRefObject } from "react";
import { StreamManager } from "openvidu-browser";
import "@/assets/styles/liveLoding.css";
import { Id, toast } from "react-toastify";

interface VideoStreamProps {
	className: string;
	streamManager?: StreamManager;
	toastId: MutableRefObject<Id | undefined>;
}

function VideoStream({ className, streamManager, toastId }: VideoStreamProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const interval = useRef<any>();

	useEffect(() => {
		return () => {
			if (interval.current) clearInterval(interval.current);
			if (toastId.current) toast.dismiss(toastId.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!(streamManager && videoRef.current)) return;

		streamManager.addVideoElement(videoRef.current);
		if (!streamManager.stream.isLocal()) videoRef.current.muted = false;

		videoRef.current.play().catch(() => {
			if (toastId.current === undefined) {
				// eslint-disable-next-line no-param-reassign
				toastId.current = toast.info(
					"브라우저 정책으로 인해 토론을 보려면 클릭이나 키보드 입력을 해주세요",
					{ autoClose: false },
				);
			}
			interval.current = setInterval(() => {
				if (videoRef.current?.paused) {
					videoRef.current.play();
				} else {
					clearInterval(interval.current);
					if (toastId.current) toast.dismiss(toastId.current);
					// eslint-disable-next-line no-param-reassign
					toastId.current = undefined;
				}
			}, 200);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [streamManager]);

	return (
		<div className={className}>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				preload="none"
				className={
					streamManager ? "w-full max-w-[480px] max-h-[240px]" : "hidden"
				}
			>
				<track kind="captions" default />
			</video>
			<div
				className={
					streamManager ? "hidden" : "flex flex-col items-center justify-center"
				}
			>
				<p className="relative">발언자가 접속하기를 기다리는중</p>
				<div className="loading">
					<span />
					<span />
					<span />
					<span />
					<span />
				</div>
			</div>
		</div>
	);
}

export default VideoStream;
