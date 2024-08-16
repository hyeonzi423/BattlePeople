import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";
import Dropdown from "@/components/Board/regist/Dropdown";
import { categories } from "@/constant/boardCategory";
import { BasicUserInfo } from "@/types/user";
import {
	Form,
	FormGroup,
	FlexFormGroup,
	Label,
	Input,
	TextArea,
	ButtonGroup,
	Button,
	ErrorLabel,
} from "@/assets/styles/battleRegist";
import { battleService } from "@/services/battleService";
import { authService } from "@/services/userAuthService";

const Options = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 5px;
	padding: 5px;
	background-color: #ffffff;
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	z-index: 1000;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	max-height: 200px; /* 고정 크기 */
	overflow-y: auto; /* 스크롤 추가 */
	/* Optional: Custom scrollbar styling */
	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #000000;
		border-radius: 10px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: #aaaaaa;
	}
	&::-webkit-scrollbar-track {
		background-color: #f0f0f0;
		border-radius: 10px;
	}
`;

const Option = styled.div`
	border-radius: 5px;
	padding: 12px 16px;
	transition: 300ms;
	background-color: #ffffff;
	font-size: 14px;
	color: #000000;
	cursor: pointer;
	&:hover {
		background-color: #f0f0f0;
	}
`;

const fetchUserSuggestions = async (
	nickname: string,
): Promise<BasicUserInfo[]> => {
	try {
		const response = await authService.searchUserByNickname(nickname);
		return response.data || [];
	} catch (error) {
		console.error("Error fetching user suggestions: ", error);
		return [];
	}
};

function LiveDebateRegistForm() {
	const navigate = useNavigate();
	const categoryNames = categories
		.filter((category) => category.name !== "전체")
		.map((category) => category.name);
	const location = useLocation();
	const user = location.state?.user as BasicUserInfo | null;

	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [opponent, setOpponent] = useState("");
	const [opponentId, setOpponentId] = useState<number | null>(null);
	const [opponentSuggestions, setOpponentSuggestions] = useState<
		BasicUserInfo[]
	>([]);
	const [authorChoice, setAuthorChoice] = useState("");
	const [startTime, setStartTime] = useState("");
	const [duration, setDuration] = useState("10");
	const [maxParticipants, setMaxParticipants] = useState("");
	const [details, setDetails] = useState("");
	const [errors, setErrors] = useState({
		title: false,
		category: false,
		opponent: false,
		authorChoice: false,
		startTime: false,
		duration: false,
		maxParticipants: false,
		details: false,
	});

	const handleCategorySelect = (category: string) => {
		setCategory(category);
		setErrors((prevErrors) => ({ ...prevErrors, category: false }));
	};

	const handleDurationSelect = (value: string) => {
		setDuration(value);
		setErrors((prevErrors) => ({ ...prevErrors, duration: false }));
	};

	const getMinDateTime = (): string => {
		const now = new Date();
		now.setMinutes(now.getMinutes() + 3);

		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const day = String(now.getDate()).padStart(2, "0");
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");

		const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
		return minDateTime;
	};

	const handleStartTimeChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const selectedTime = new Date(event.target.value);
		const minDateTime = new Date(getMinDateTime());

		if (selectedTime < minDateTime) {
			toast.error("라이브 개최 시간은 최소 3분 이후로 설정해주세요.", {
				autoClose: 1500,
			});
			setStartTime(getMinDateTime());
		} else {
			setStartTime(event.target.value);
			setErrors((prevErrors) => ({ ...prevErrors, startTime: false }));
		}
	};

	const debouncedFetchSuggestions = useMemo(
		() =>
			debounce(async (nickname: string) => {
				const suggestions = await fetchUserSuggestions(nickname);
				setOpponentSuggestions(suggestions);
			}, 300),
		[],
	);

	// Wrapping the debounced function with useCallback
	const debounceFetchUserSuggestions = useCallback(
		(nickname: string) => debouncedFetchSuggestions(nickname),
		[debouncedFetchSuggestions],
	);

	const handleOpponentInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const nickname = event.target.value;
		setOpponent(nickname);
		setErrors((prevErrors) => ({ ...prevErrors, opponent: false }));
		setOpponentId(null);

		debounceFetchUserSuggestions(nickname);
	};

	const selectOpponent = (selectedOpponent: BasicUserInfo) => {
		setOpponent(selectedOpponent.nickname);
		setOpponentId(selectedOpponent.id);
		setOpponentSuggestions([]);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const newErrors = {
			title: !title,
			category: !category,
			opponent: !opponent || opponentId === null, // Ensure this returns a boolean
			authorChoice: !authorChoice,
			startTime: !startTime,
			duration: !duration,
			maxParticipants:
				!maxParticipants ||
				parseInt(maxParticipants, 10) < 5 ||
				parseInt(maxParticipants, 10) > 99,
			details: !details,
		};

		if (Object.values(newErrors).some((error) => error)) {
			setErrors(newErrors);
			return;
		}

		const selectedCategory = categories.find(
			(cat) => cat.name === category,
		)?.id;

		if (selectedCategory === undefined) {
			console.error("Invalid category selected");
			return;
		}

		if (opponentId === null) {
			alert("상대방 닉네임을 찾을 수 없습니다.");
			return;
		}

		const minPeopleCount = 5;

		const startDate = new Date(startTime);
		const endDate = new Date(
			startDate.getTime() + parseInt(duration, 10) * 60000,
		);

		const dataToSend = {
			title,
			detail: details,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
			time: parseInt(duration, 10),
			category: selectedCategory,
			oppositeUserId: opponentId,
			opinion: authorChoice,
			minPeopleCount,
			maxPeopleCount: parseInt(maxParticipants, 10),
			battleRule: "",
		};

		console.log("Data to be sent:", dataToSend);

		try {
			console.log("Sending data to the server...", dataToSend);
			const response = await battleService.inviteBattle(dataToSend);
			console.log("Received response from server:", response);

			if (response.code === "fail") {
				alert(response.msg);
			} else {
				console.log("Battle invitation sent successfully:", response);
				navigate("/fanning");
				toast.info("배틀 신청이 성공적으로 전달되었습니다!", {
					autoClose: 1500,
				});
			}
		} catch (error) {
			console.error("Failed to invite to battle:", error);
			toast.error("이미 해당시간에 예정된 배틀이 존재합니다.", {
				autoClose: 1500,
			});
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<FormGroup>
				<FlexFormGroup>
					<FormGroup style={{ flex: 2 }}>
						<Label htmlFor="title">
							제목
							{errors.title && <ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>}
						</Label>
						<Input
							id="title"
							type="text"
							placeholder="제목을 입력하세요"
							value={title}
							maxLength={16}
							onChange={(e) => {
								setTitle(e.target.value);
								setErrors((prevErrors) => ({
									...prevErrors,
									title: false,
								}));
							}}
						/>
					</FormGroup>
					<FormGroup style={{ flex: 1 }}>
						<Label htmlFor="category">
							카테고리
							{errors.category && (
								<ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>
							)}
						</Label>
						<Dropdown
							options={categoryNames}
							defaultOption="카테고리 선택"
							onSelect={handleCategorySelect}
						/>
					</FormGroup>
				</FlexFormGroup>
			</FormGroup>
			<FlexFormGroup>
				<FormGroup style={{ flex: 1 }}>
					<Label htmlFor="author">작성자 닉네임</Label>
					<Input
						id="author"
						type="text"
						value={user?.nickname || ""}
						placeholder="닉네임을 입력하세요"
						disabled
					/>
				</FormGroup>
				<FormGroup style={{ flex: 1, position: "relative" }}>
					<Label htmlFor="opponent">
						상대방 닉네임
						{errors.opponent && opponent && opponentId === null ? (
							<ErrorLabel> 등록되지 않은 사용자입니다.</ErrorLabel>
						) : (
							errors.opponent && <ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>
						)}
					</Label>
					<Input
						id="opponent"
						type="text"
						placeholder="상대방 닉네임을 입력하세요"
						value={opponent}
						onChange={handleOpponentInputChange}
					/>
					{opponentSuggestions.length > 0 && (
						<Options>
							{opponentSuggestions.map((suggestion) => (
								<Option
									key={suggestion.id}
									onClick={() => selectOpponent(suggestion)}
								>
									{suggestion.nickname}
								</Option>
							))}
						</Options>
					)}
				</FormGroup>
			</FlexFormGroup>
			<FlexFormGroup>
				<FormGroup style={{ flex: 1 }}>
					<Label htmlFor="authorChoice">
						작성자 선택지
						{errors.authorChoice && (
							<ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>
						)}
					</Label>
					<Input
						id="authorChoice"
						type="text"
						maxLength={16}
						placeholder="작성자 선택지를 입력하세요"
						value={authorChoice}
						onChange={(e) => {
							setAuthorChoice(e.target.value);
							setErrors((prevErrors) => ({
								...prevErrors,
								authorChoice: false,
							}));
						}}
					/>
				</FormGroup>
				<FormGroup style={{ flex: 1 }}>
					<Label htmlFor="opponentChoice">상대방 선택지</Label>
					<Input
						id="opponentChoice"
						type="text"
						placeholder="상대방 선택지는 상대방이 작성합니다."
						value=""
						disabled
						style={{ cursor: "not-allowed" }}
					/>
				</FormGroup>
			</FlexFormGroup>
			<FlexFormGroup>
				<FormGroup style={{ flex: 2 }}>
					<Label htmlFor="startTime">
						라이브 시작 시간
						{errors.startTime && (
							<ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>
						)}
					</Label>
					<Input
						id="startTime"
						type="datetime-local"
						min={getMinDateTime()}
						value={startTime}
						onChange={handleStartTimeChange}
						placeholder="라이브 시작 시간을 입력하세요"
					/>
				</FormGroup>
				<FormGroup style={{ flex: 1 }}>
					<Label htmlFor="duration">
						분
						{errors.duration && <ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>}
					</Label>
					<Dropdown
						options={["10", "20", "30", "40", "50", "60"]}
						defaultOption="10"
						onSelect={handleDurationSelect}
					/>
				</FormGroup>
				<FormGroup style={{ flex: 1 }}>
					<Label htmlFor="maxParticipants">
						최대 인원 수
						{errors.maxParticipants && (
							<ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>
						)}
					</Label>
					<Input
						id="maxParticipants"
						type="number"
						placeholder="최대 인원 수"
						value={maxParticipants}
						min={5}
						max={99}
						onChange={(e) => {
							setMaxParticipants(e.target.value);
							setErrors((prevErrors) => ({
								...prevErrors,
								maxParticipants: false,
							}));
						}}
					/>
				</FormGroup>
			</FlexFormGroup>
			<FormGroup>
				<Label htmlFor="details">
					토론 상세 정보 작성
					{errors.details && <ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>}
				</Label>
				<TextArea
					id="details"
					placeholder="상세 정보를 입력하세요"
					value={details}
					onChange={(e) => {
						setDetails(e.target.value);
						setErrors((prevErrors) => ({
							...prevErrors,
							details: false,
						}));
					}}
				/>
			</FormGroup>
			<ButtonGroup>
				<Button type="submit">등록</Button>
			</ButtonGroup>
		</Form>
	);
}

export default LiveDebateRegistForm;
