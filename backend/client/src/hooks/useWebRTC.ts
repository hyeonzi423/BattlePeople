import { RefObject, useEffect, useRef } from "react";
import useOpenVidu from "./useOpenVidu";
import useFaceApi from "./useFaceApi";

const publishFrameRate = 30;

const useWebRTC = (
	isMicMuted: boolean,
	isVideoDisabled: boolean,
	video: RefObject<HTMLVideoElement>,
	canvasForPublish: RefObject<HTMLCanvasElement>,
	canvasForMask: RefObject<HTMLCanvasElement>,
) => {
	const shouldRenderVideo = useRef<boolean>(true);
	const timeout = useRef<unknown>();
	const stream = useRef<MediaStream>();

	const {
		joinSession,
		publishMedia,
		unpublishMedia,
		index,
		connectionId,
		subscribers,
		isPublisher,
		publisher,
		shouldPublish,
	} = useOpenVidu();
	const { shouldRenderMask, drawMask } = useFaceApi(video, canvasForMask);

	const setRenderMask = (shouldRender: boolean) => {
		if (
			shouldRender &&
			shouldRenderMask.current !== shouldRender &&
			shouldPublish
		) {
			shouldRenderMask.current = true;
			drawMask();
		} else if (!shouldRender) {
			shouldRenderMask.current = false;
		}
	};

	const clear = () => {
		console.log("CLEAR");
		if (timeout.current) clearTimeout(timeout.current as number);
		timeout.current = undefined;
		console.log(stream.current, stream.current?.getTracks());
		stream.current?.getTracks().forEach((track) => {
			track.stop();
			stream.current!.removeTrack(track);
		});
		stream.current = undefined;
		// eslint-disable-next-line no-param-reassign
		if (video.current) video.current!.onplay = null;
	};

	useEffect(() => {
		return () => {
			clear();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderVideoToCanvas = () => {
		if (!video.current!.paused && !video.current!.ended) {
			const ctx = canvasForPublish.current?.getContext("2d");
			ctx?.drawImage(
				video.current!,
				0,
				0,
				canvasForPublish.current!.width,
				canvasForPublish.current!.height,
			);
			if (shouldRenderMask.current)
				ctx?.drawImage(
					canvasForMask.current!,
					0,
					0,
					canvasForPublish.current!.width,
					canvasForPublish.current!.height,
				);
		}
		requestAnimationFrame(renderVideoToCanvas);
	};

	const startVideo = async () => {
		const s = await navigator.mediaDevices.getUserMedia({
			video: true,
		});

		// eslint-disable-next-line no-param-reassign
		video.current!.onplay = () => {
			renderVideoToCanvas();
		};
		// eslint-disable-next-line no-param-reassign
		video.current!.srcObject = s;
		stream.current = s;
	};

	useEffect(() => {
		if (!shouldPublish) {
			unpublishMedia();
			return;
		}

		startVideo().then(() => {
			const mediaStreamTrack = canvasForPublish
				.current!.captureStream(publishFrameRate)
				.getVideoTracks()
				.at(0)!;
			if (!mediaStreamTrack) throw new Error("NOMEDIA");
			mediaStreamTrack.contentHint = "motion";
			shouldRenderVideo.current = true;

			publishMedia(
				mediaStreamTrack,
				undefined,
				!isMicMuted,
				!isVideoDisabled,
				publishFrameRate,
			);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldPublish]);

	return {
		joinSession,
		index,
		isPublisher,
		publisher,
		subscribers,
		connectionId,
		setRenderMask,
	};
};

export default useWebRTC;
