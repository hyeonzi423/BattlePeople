import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import Dropdown from "@/components/Board/regist/Dropdown";
import { categories } from "@/constant/boardCategory";
import { DetailUserInfo } from "@/types/user";
import { balanceGameService } from "@/services/balanceGameService";
import { Vote, Opinion } from "@/types/vote";
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

function BalanceGameRegistForm() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [optionA, setOptionA] = useState("");
	const [optionB, setOptionB] = useState("");
	const [details, setDetails] = useState("");
	const [errors, setErrors] = useState({
		title: false,
		category: false,
		optionA: false,
		optionB: false,
		details: false,
	});

	const categoryNames = categories
		.filter((category) => category.name !== "전체")
		.map((category) => category.name);

	const handleCategorySelect = (category: string) => {
		setCategory(category);
		setErrors((prevErrors) => ({ ...prevErrors, category: false }));
	};

	const location = useLocation();
	const user = location.state?.user as DetailUserInfo | null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors = {
			title: !title,
			category: !category,
			optionA: !optionA,
			optionB: !optionB,
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

		const voteData: Vote = {
			title,
			detail: details,
			startDate: new Date().toISOString(),
			endDate: new Date(Date.now() + 3600000).toISOString(),
			category: selectedCategory,
		};

		const opinions: Opinion[] = [
			{ index: 0, opinion: optionA },
			{ index: 1, opinion: optionB },
		];

		const dataToSend = {
			...voteData,
			opinions: opinions.map((opinion) => opinion.opinion),
		};

		console.log("Data to be sent:", dataToSend);

		try {
			const response = await balanceGameService.createBalanceGame(dataToSend);
			console.log("Form submitted successfully:", response);
			navigate("/bonfire");
		} catch (error) {
			console.error("Failed to submit form:", error);
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
								setErrors((prevErrors) => ({ ...prevErrors, title: false }));
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
			<FormGroup>
				<Label htmlFor="author">작성자 닉네임</Label>
				<Input
					id="author"
					type="text"
					value={user?.nickname || ""}
					placeholder="닉네임을 입력하세요"
					disabled
					style={{ cursor: "default" }}
				/>
			</FormGroup>
			<FlexFormGroup>
				<FormGroup style={{ flex: 1 }}>
					<Label htmlFor="optionA">
						선택지 A
						{errors.optionA && <ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>}
					</Label>
					<Input
						id="optionA"
						type="text"
						placeholder="선택지 A를 입력하세요"
						value={optionA}
						maxLength={16}
						onChange={(e) => {
							setOptionA(e.target.value);
							setErrors((prevErrors) => ({ ...prevErrors, optionA: false }));
						}}
					/>
				</FormGroup>
				<FormGroup style={{ flex: 1 }}>
					<Label htmlFor="optionB">
						선택지 B
						{errors.optionB && <ErrorLabel> 필수 입력 사항입니다.</ErrorLabel>}
					</Label>
					<Input
						id="optionB"
						type="text"
						placeholder="선택지 B를 입력하세요"
						value={optionB}
						maxLength={16}
						onChange={(e) => {
							setOptionB(e.target.value);
							setErrors((prevErrors) => ({ ...prevErrors, optionB: false }));
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
						setErrors((prevErrors) => ({ ...prevErrors, details: false }));
					}}
				/>
			</FormGroup>
			<ButtonGroup>
				<Button type="submit">등록</Button>
			</ButtonGroup>
		</Form>
	);
}

export default BalanceGameRegistForm;
