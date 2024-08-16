import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router-dom";
import BalanceGameRegistForm from "@/components/Board/regist/BalanceGameRegistForm";
import LiveDebateRegistForm from "@/components/Board/regist/LiveDebateRegistForm";
import Header from "@/components/header";
import { BattleRegistOption } from "@/types/Board/battleRegistOption";
import useRequireAuth from "@/hooks/useRequireAuth";

const PageContainer = styled.div`
	min-height: 100vh;
	margin-top: 100px;
`;

const ContentContainer = styled.div`
	max-width: 768px;
	margin: 0 auto;
	padding: 24px;
	border-radius: 18px;
	margin-top: 32px;
	border: 3.5px solid #000000;
	margin-bottom: 50px;
`;

const TitleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
`;

const Title = styled.h1`
	font-size: 1.5rem;
`;

const FormTypeSelector = styled.div`
	display: flex;
	gap: 16px;
`;

const FormTypeOption = styled.div<{ isSelected: boolean }>`
	position: relative;
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 8px;
	border-radius: 8px;
	transition: all 0.3s ease;

	&:focus {
		outline: none;
	}
`;

const RadioInput = styled.input`
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
	cursor: pointer;
`;

const RadioButtonCustom = styled.span<{ isSelected: boolean }>`
	position: relative;
	margin-right: 8px;
	display: inline-block;
	width: 16px;
	height: 16px;
	border: 2px solid ${({ isSelected }) => (isSelected ? "#f66c23" : "#333")};
	border-radius: 50%;
	transition: all 0.3s ease;

	${({ isSelected }) =>
		isSelected &&
		css`
			&::after {
				content: "";
				position: absolute;
				top: 50%;
				left: 50%;
				width: 8px;
				height: 8px;
				background-color: #f66c23;
				border-radius: 50%;
				transform: translate(-50%, -50%);
				transition: all 0.3s ease;
			}
		`}
`;

function BattleRegistPage({
	defaultForm = "general",
}: {
	defaultForm?: BattleRegistOption;
}) {
	useRequireAuth();

	const location = useLocation();
	const initialForm = location.state?.defaultForm || defaultForm;

	const [activeForm, setActiveForm] = useState<BattleRegistOption>(initialForm);

	const handleKeyPress = (
		event: React.KeyboardEvent<HTMLDivElement>,
		formType: BattleRegistOption,
	) => {
		if (event.key === "Enter" || event.key === " ") {
			setActiveForm(formType);
		}
	};

	return (
		<PageContainer>
			<Header />
			<ContentContainer>
				<TitleContainer>
					<Title>새로운 토론 주제 등록</Title>
					<FormTypeSelector>
						{["general", "live"].map((type) => (
							<FormTypeOption
								key={type}
								isSelected={activeForm === type}
								onClick={() => setActiveForm(type as BattleRegistOption)}
								onKeyPress={(e) =>
									handleKeyPress(e, type as BattleRegistOption)
								}
								tabIndex={0}
								role="button"
							>
								<RadioInput
									type="radio"
									name="formType"
									value={type}
									checked={activeForm === type}
									onChange={() => setActiveForm(type as BattleRegistOption)}
								/>
								<RadioButtonCustom isSelected={activeForm === type} />
								<span>
									{type === "general" ? "밸런스 게임" : "라이브 개최"}
								</span>
							</FormTypeOption>
						))}
					</FormTypeSelector>
				</TitleContainer>
				{activeForm === "general" && <BalanceGameRegistForm />}
				{activeForm === "live" && <LiveDebateRegistForm />}
			</ContentContainer>
		</PageContainer>
	);
}

export default BattleRegistPage;
