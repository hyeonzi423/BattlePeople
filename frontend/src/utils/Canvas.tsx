/* eslint-disable no-lone-blocks */
// ConfettiComponent.tsx
import { useRef, useEffect } from "react";
import canvasConfetti from "canvas-confetti";

{
	/* 사용 예시
		<ConfettiComponent
			particleCount={200}
			spread={150}
			origin={{ x: 0.5, y: 0.7 }}
		/> */
}

interface CanvasProps {
	particleCount: number;
	spread: number;
	origin: { x: number; y: number };
}

function ConfettiComponent({ particleCount, spread, origin }: CanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			const confetti = canvasConfetti.create(canvasRef.current, {
				resize: true,
				useWorker: true,
			});

			confetti({
				particleCount, // 색종이의 개수
				spread, // 색종이가 퍼지는 범위(default: 45)
				origin, // 색종이가 터지는 처음 위치(x: 0, y: 0)
				// colors: ["#F66C23", "#0B68EC", "#FBCA27", "#B4CC38"], // 색 지정
				// shapes: ["circle", "square"], // 색종이 모양 지정
			});
		}
	}, [particleCount, spread, origin]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: 9999,
			}}
		/>
	);
}

export default ConfettiComponent;
