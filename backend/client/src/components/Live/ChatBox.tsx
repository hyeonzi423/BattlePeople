import React, { useState, useRef, useEffect } from "react";
import { RiCornerDownLeftLine } from "react-icons/ri";
import { ChatMessage } from "@/types/Chat";
import "@/assets/styles/scrollbar.css";

function Chat({ user, message, userVote }: ChatMessage) {
	let borderColorClass = "";

	if (userVote === 0) {
		borderColorClass = "border-orange";
	} else if (userVote === 1) {
		borderColorClass = "border-blue";
	}

	return (
		<div
			className={`mb-2 p-2 border-solid border-2 rounded-lg ${borderColorClass}`}
		>
			<div>
				<strong>{user.nickname}</strong>: {message}
			</div>
		</div>
	);
}

interface ChatInputProps {
	sendMessage: (message: string) => void;
}

function ChatInput({ sendMessage }: ChatInputProps) {
	const [input, setInput] = useState<string>("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey && input.trim() !== "") {
			event.preventDefault();
			sendMessage(input);
			setInput("");
		}
	};

	// 동적으로 높이를 조절하는 로직
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto"; // 높이를 자동으로 조절
			const { scrollHeight } = textareaRef.current;
			textareaRef.current.style.height = `${Math.min(scrollHeight, 100)}px`; // 최대 100px까지만 늘어나도록 제한
		}
	}, [input]);

	return (
		<div className="flex p-2 border-solid border-4 border-black rounded-lg">
			<textarea
				ref={textareaRef}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="채팅을 입력해주세요."
				className="flex-1 px-2 py-1 outline-none resize-none overflow-y-auto scrollbar-hide"
			/>
			<RiCornerDownLeftLine className="h-full w-6" />
		</div>
	);
}

interface ChatBoxProps {
	messages: ChatMessage[];
	sendMessage: (userId: number, message: string) => void;
	userId: number;
}
function ChatBox({ messages, sendMessage, userId }: ChatBoxProps) {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto p-2 my-2 border-solid border-4 border-black rounded-lg flex flex-col-reverse scrollbar-hide break-all">
				<div>
					{messages.map((msg) => (
						<Chat
							key={msg.idx}
							idx={msg.idx}
							user={msg.user}
							message={msg.message}
							userVote={msg.userVote}
						/>
					))}
				</div>
			</div>
			<ChatInput sendMessage={(message) => sendMessage(userId, message)} />
		</div>
	);
}

export default ChatBox;
