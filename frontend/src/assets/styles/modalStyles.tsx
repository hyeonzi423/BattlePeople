import styled from "styled-components";

export const ModalBackdrop = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 50;
`;

export const ModalContent = styled.div<{ borderColor: string }>`
	background-color: white;
	padding: 16px;
	border-radius: 20px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	max-width: 800px;
	width: 100%;
	border: 8px solid ${({ borderColor }) => borderColor};
`;

export const ManualModalContent = styled.div<{ borderColor: string }>`
	background-color: white;
	padding: 16px;
	border-radius: 20px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	height: 550px;
	max-width: 800px;
	width: 100%;
	border: 8px solid ${({ borderColor }) => borderColor};
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 8px;
	padding-left: 15px;
	padding-top: 15px;
	position: relative;
`;

export const ModalTitle = styled.h2`
	font-size: 1.5rem;
	flex: 1;
`;

export const ManualModalTitle = styled.h2`
	font-size: 1.5rem;
	flex: 1;
`;

export const CloseButton = styled.button<{ borderColor: string }>`
	font-size: 1.5rem;
	background: none;
	border: none;
	cursor: pointer;
	position: absolute;
	top: 0;
	right: 0;
	color: ${({ borderColor }) => borderColor};
`;

export const ModalBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 8px;
`;

export const InfoText = styled.p<{ borderColor: string }>`
	font-size: 1.1rem;
	font-weight: 600;
	color: #4b5563;
	border-radius: 15px;
	padding: 20px;
	height: 150px;
	overflow-y: auto; /* Enable vertical scrolling */
	overflow-x: hidden; /* Prevent horizontal scrolling */
	background-color: #f9fafb;
	border: 3px solid ${({ borderColor }) => borderColor};
	text-align: center;
	box-sizing: border-box;
	word-wrap: break-word;
	max-width: 100%; /* Ensure no overflow */
`;

export const InfoTextSpan = styled.span`
	font-weight: 400;
	color: #6b7280;
	display: block;
`;

export const TitleText = styled.p<{ borderColor: string }>`
	font-size: 1.1rem;
	color: #4b5563;
	border-radius: 15px;
	padding: 10px;
	padding-left: 20px;
	height: 50px;
	background-color: #f9fafb;
	border: 3px solid ${({ borderColor }) => borderColor};
`;

export const Opponents = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	position: relative;
	margin-top: 10px;
	margin-bottom: 10px;
`;

export const Opponent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 30px;
`;

export const OpponentImage = styled.img<{ borderColor: string }>`
	width: 65px;
	height: 65px;
	border-radius: 50%;
	margin-bottom: 8px;
	margin-top: 8px;
	border: 4px solid ${({ borderColor }) => borderColor};
`;

export const SpeechBubble = styled.div`
	position: relative;
	border-radius: 10px;
	padding: 10px;
	width: 150px;
	margin-bottom: 8px;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	word-break: break-word;
	word-wrap: break-word;
	&:after {
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		border: solid transparent;
		height: 0;
		width: 0;
		pointer-events: none;
		border-color: rgba(255, 255, 255, 0);
		border-top-color: inherit;
		border-width: 10px;
		margin-left: -10px;
	}
`;

export const VoteResult = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

export const VoteColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

export const ProgressBarContainer = styled.div`
	width: 100%;
	margin-bottom: 0px;
	position: relative;
	height: 24px;
	border-radius: 12px;
	overflow: hidden;
	background-color: #f0f0f0;
`;

export const ProgressBar = styled.div<{ percentage: number; color: string }>`
	width: ${({ percentage }) => percentage}%;
	height: 24px;
	background-color: ${({ color }) => color};
	position: absolute;
	top: 0;
	left: 0;
`;

export const VoteRow = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	padding: 8px;
`;

export const VoteText = styled.p`
	font-size: 1rem;
	margin-bottom: 5px;
`;

export const VoteResultsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-grow: 1;
`;

export const VS = styled.div`
	font-size: 2rem;
	font-weight: bold;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;
