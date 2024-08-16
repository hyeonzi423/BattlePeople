import { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { categories } from "@/constant/boardCategory";
import { authService } from "@/services/userAuthService";

const InterestsContainer = styled.div`
	text-align: center;
	padding: 20px;
`;

const InterestsTextContainer = styled.div`
	text-align: left;
	margin-bottom: 20px;
`;

const InterestsHeader = styled.h2`
	font-size: 24px;
`;

const InterestsSubHeader = styled.p`
	font-size: 18px;
	margin-bottom: 10px;
`;

const InterestsButtonsContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 10px;
	justify-content: center;
	margin-bottom: 20px;
`;

interface InterestButtonProps {
	isSelected: boolean;
}

const InterestButton = styled.button<InterestButtonProps>`
	padding: 10px 20px;
	border: 4px solid ${({ isSelected }) => (isSelected ? "#001f3f" : "#999999")};
	background-color: #ffffff;
	color: ${({ isSelected }) => (isSelected ? "#001f3f" : "#000000")};
	border-radius: 30px;
	cursor: pointer;
	font-size: 16px;
	transition: all 0.3s ease;
`;

const SaveButton = styled.button`
	grid-column: 4 / span 1;
	grid-row: 2;
	padding: 12px 20px;
	background-color: #001f3f;
	color: #fff;
	border: none;
	border-radius: 30px;
	cursor: pointer;
	font-size: 16px;

	&:hover {
		background-color: #003366;
	}
`;

function Interests() {
	const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

	// 컴포넌트가 로드될 때 초기 선택된 관심사를 불러오기
	useEffect(() => {
		const fetchSelectedInterests = async () => {
			try {
				const interests = await authService.getUserInterests();
				setSelectedInterests(interests);
			} catch (error) {
				console.error("Failed to fetch user interests:", error);
			}
		};

		fetchSelectedInterests();
	}, []);

	const toggleInterest = (interestId: number) => {
		setSelectedInterests((prevSelected) =>
			prevSelected.includes(interestId)
				? prevSelected.filter((id) => id !== interestId)
				: [...prevSelected, interestId],
		);
	};

	const handleSave = async () => {
		try {
			const response = await authService.postUserInterests(selectedInterests);
			if (response.code === "success") {
				toast.info("관심사 저장이 완료되었습니다.", { autoClose: 1000 });
			}
		} catch (error) {
			console.error("Failed to save user interests:", error);
		}
	};

	return (
		<InterestsContainer>
			<InterestsTextContainer>
				<InterestsHeader>무엇을 좋아하세요?</InterestsHeader>
				<InterestsSubHeader>
					맞춤 컨텐츠를 우선으로 보여드립니다!
				</InterestsSubHeader>
			</InterestsTextContainer>
			<InterestsButtonsContainer>
				{categories
					.filter((category) => category.id !== 7)
					.map((category) => (
						<InterestButton
							key={category.id}
							isSelected={selectedInterests.includes(category.id)}
							onClick={() => toggleInterest(category.id)}
						>
							{category.name}
						</InterestButton>
					))}
				<SaveButton onClick={handleSave}>저장</SaveButton>
			</InterestsButtonsContainer>
		</InterestsContainer>
	);
}

export default Interests;
