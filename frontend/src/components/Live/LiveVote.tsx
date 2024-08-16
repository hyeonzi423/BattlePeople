import { useEffect } from "react";
import { VoteInfoResponse } from "@/types/vote";

interface VoteGaugeProps {
	voteState: VoteInfoResponse;
}

function VoteGauge({ voteState }: VoteGaugeProps) {
	return (
		<div className="relative w-full h-10 flex items-center border-solid border-4 border-black rounded-lg overflow-hidden">
			{/* 좌측 텍스트 (주황색 쪽) */}
			<span className="absolute left-0 pl-2 text-black font-bold z-10">
				{voteState.opinions[0].count}
			</span>

			{/* 우측 텍스트 (파란색 쪽) */}
			<span className="absolute right-0 pr-2 text-black font-bold z-10">
				{voteState.opinions[1].count}
			</span>

			{/* 주황색 막대 */}
			<div className="w-full h-full relative">
				<div
					className="bg-orange h-full absolute left-0 transition-all duration-500"
					style={{ width: `${voteState.opinions[0].percentage}%` }}
				/>
				{/* 파란색 막대 */}
				<div
					className="bg-blue h-full absolute right-0 transition-all duration-500"
					style={{ width: `${voteState.opinions[1].percentage}%` }}
				/>
			</div>
		</div>
	);
}

interface LiveVoteProps {
	choice: number;
	setChoice: (vote: number) => void;
	userId: number;
	role: number;
	voteState: VoteInfoResponse;
	title: string;
	optionA: string;
	optionB: string;
	handleVote: (userId: number, voteInfoIndex: number) => void;
	onVoteEnd: (winner: string) => void; // 투표가 끝났을 때 호출되는 함수
}

function LiveVote({
	choice,
	setChoice,
	userId,
	role,
	voteState,
	title,
	optionA,
	optionB,
	handleVote,
	onVoteEnd,
}: LiveVoteProps) {
	useEffect(() => {
		const winner =
			voteState.opinions[0].count > voteState.opinions[1].count
				? optionA
				: optionB;
		onVoteEnd(winner);
	}, [onVoteEnd, optionA, optionB, voteState]);

	const handleVoteClick = (vote: number) => {
		handleVote(userId, vote);
		setChoice(vote);
	};

	return (
		<div className="flex flex-col items-center mb-2">
			<h1 className="text-2xl my-2">{title}</h1>
			<div className="flex flex-row items-center justify-between w-3/4">
				<button
					type="button"
					className={`bg-gray-800 me-3 mb-4 px-3 py-2 rounded-md text-white tracking-wider shadow-xl animate-bounce hover:animate-none ${choice === 0 ? "bg-olive text-white" : ""}`}
					onClick={() => handleVoteClick(0)}
					disabled={role === 0 || role === 1}
				>
					{optionA}
				</button>
				<VoteGauge voteState={voteState} />
				<button
					type="button"
					className={`bg-gray-800 ms-3 mb-4 px-3 py-2 rounded-md text-white tracking-wider shadow-xl animate-bounce hover:animate-none ${choice === 1 ? "bg-olive text-white" : ""}`}
					onClick={() => handleVoteClick(1)}
					disabled={role === 0 || role === 1}
				>
					{optionB}
				</button>
			</div>
		</div>
	);
}

export default LiveVote;
