import * as faceapi from "face-api.js";
import { RefObject, useEffect, useRef } from "react";

const useFaceApi = (
	video: RefObject<HTMLVideoElement>,
	canvas: RefObject<HTMLCanvasElement>,
) => {
	const shouldRenderMask = useRef<boolean>(false);
	const isModelLoading = useRef<boolean>(false);

	// tiny_face_detector options
	const inputSize = 224;
	const scoreThreshold = 0.4;

	const isFaceDetectionModelLoaded = () => {
		return (
			!!faceapi.nets.tinyFaceDetector.params &&
			!!faceapi.nets.faceLandmark68TinyNet.params
		);
	};

	const getFaceDetectorOptions = () => {
		return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
	};

	const render2DCharacter = (
		detection: faceapi.WithFaceLandmarks<{
			detection: faceapi.FaceDetection;
		}>,
		ctx: CanvasRenderingContext2D,
	) => {
		const { positions } = detection.landmarks;

		const leftEye = positions[36];
		const rightEye = positions[45];
		const mouthLeft = positions[48];
		const mouthRight = positions[54];
		const mouthTop = positions[51];
		const mouthBottom = positions[57];
		// const nose = positions[30];

		const faceWidth = detection.alignedRect.box.width;
		const faceHeight = detection.alignedRect.box.height;

		const faceX = detection.alignedRect.box.x;
		const faceY = detection.alignedRect.box.y;

		ctx.fillStyle = "blue";
		ctx.fillRect(faceX, faceY, faceWidth, faceHeight);

		// Draw eyes
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(leftEye.x, leftEye.y, faceWidth * 0.1, 0, Math.PI * 2);
		ctx.arc(rightEye.x, rightEye.y, faceWidth * 0.1, 0, Math.PI * 2);
		ctx.fill();

		// Draw pupils
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(leftEye.x, leftEye.y, faceWidth * 0.05, 0, Math.PI * 2);
		ctx.arc(rightEye.x, rightEye.y, faceWidth * 0.05, 0, Math.PI * 2);
		ctx.fill();

		// Draw upper lip
		ctx.fillStyle = "red";
		ctx.fillRect(
			mouthLeft.x,
			mouthTop.y,
			mouthRight.x - mouthLeft.x,
			(mouthBottom.y - mouthTop.y) / 2,
		);

		// Draw lower lip
		ctx.fillStyle = "white";
		ctx.fillRect(
			mouthLeft.x,
			mouthTop.y + (mouthBottom.y - mouthTop.y) / 2,
			mouthRight.x - mouthLeft.x,
			(mouthBottom.y - mouthTop.y) / 2,
		);
	};

	const loadModel = () => {
		if (isModelLoading.current === false) {
			isModelLoading.current = true;
			return Promise.all([
				faceapi.nets.tinyFaceDetector.loadFromUri("/weights"),
				faceapi.nets.faceLandmark68TinyNet.loadFromUri("/weights"),
			]).then(() => {
				isModelLoading.current = false;
			});
		}
		return Promise.reject();
	};

	const drawMask = async () => {
		if (!shouldRenderMask.current) {
			canvas.current
				?.getContext("2d")
				?.clearRect(0, 0, canvas.current.width, canvas.current.height);
			return;
		}
		if (!video.current) {
			setTimeout(() => drawMask(), 1000);
			return;
		}

		if (!isModelLoading.current && !isFaceDetectionModelLoaded()) {
			loadModel().then(drawMask);
			return;
		}

		const options = getFaceDetectorOptions();
		// console.time("onPlay Execution Time");
		faceapi
			.detectSingleFace(video.current!, options)
			.withFaceLandmarks(true)
			.run()
			.then((result) => {
				// console.timeEnd("onPlay Execution Time");
				if (!result) return undefined;

				const dims = faceapi.matchDimensions(
					canvas.current!,
					video.current!,
					true,
				);

				const resizedResult = faceapi.resizeResults(result, dims);
				const ctx = canvas.current!.getContext("2d")!;
				if (resizedResult) render2DCharacter(resizedResult, ctx);
				return undefined;
			})
			.then(() => drawMask());
	};

	useEffect(() => {
		drawMask();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { shouldRenderMask, drawMask };
};

export default useFaceApi;
