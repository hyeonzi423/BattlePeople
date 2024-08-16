import styled, { keyframes } from "styled-components";

export const BalanceGameCardWrapper = styled.div`
	border: 4px solid #000000;
	padding: 16px;
	margin: 12px 16px;
	width: 500px;
	border-radius: 10px;
	background-color: #ffffff;
	position: relative;
	cursor: pointer;
`;

export const Question = styled.div`
	margin-bottom: 16px;
	font-size: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	width: 100%;
`;

export const OptionWrapper = styled.div<{ disabled: boolean }>`
	display: flex;
	align-items: center;
	margin: 8px 0;
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	height: 60px;
	position: relative;
	width: 100%;
`;

export const OptionButton = styled.div<{ bgColor: string }>`
	cursor: pointer;
	transition: all 0.15s;
	background-color: #303030;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 100%;
	border-bottom-width: 4px;
	border-color: #000000;
	border-style: solid;
	font-weight: bold;
	font-size: 1.5rem;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	margin-right: 10px;

	&:hover {
		filter: brightness(110%);
		transform: translateY(-1px);
		border-bottom-width: 6px;
	}

	&:active {
		filter: brightness(90%);
		transform: translateY(2px);
		border-bottom-width: 2px;
	}
`;

export const fillAnimation = keyframes`
  from {
    background-size: 0% 100%;
  }
  to {
    background-size: 100% 100%;
  }
`;

export const OptionText = styled.div<{
	borderColor: string;
	bgColor: string;
	width: number;
}>`
	flex-grow: 1;
	padding: 8px;
	border: 3px solid ${(props) => props.borderColor};
	border-radius: 14px;
	color: #000000;
	text-align: center;
	font-size: 1.2rem;
	height: 3rem;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	z-index: 1;
	background: linear-gradient(
		to right,
		${(props) => props.bgColor} ${(props) => props.width}%,
		transparent ${(props) => props.width}%
	);
	background-size: 0 100%;
	background-repeat: no-repeat;
	animation: ${fillAnimation} 1s forwards;
`;

export const PercentageLabel = styled.div<{ color: string }>`
	font-size: 1.3rem;
	font-weight: bold;
	color: ${(props) => props.color};
	margin-right: 15px;
	width: 50px;
	text-align: right;
`;
