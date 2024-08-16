import React from "react";
import styled from "styled-components";

interface AlertModalProps {
	show: boolean;
	onClose: () => void;
	message: string;
}

const AlertModalBackground = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 20;
`;

const AlertModalContainer = styled.div`
	background-color: white;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	max-width: 550px;
	width: 100%;
	text-align: center;
	position: relative;
`;

const AlertModalMessage = styled.p`
	color: #1d3d6b;
	font-size: 18px;
	margin-bottom: 20px;
	padding: 20px;
`;

const AlertModalButton = styled.button`
	background-color: #1d3d6b;
	color: white;
	border: none;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
	width: 90%;

	&:hover {
		background-color: #fbca27;
		color: #1d3d6b;
	}
`;

const AlertModalCloseIcon = styled.button`
	position: absolute;
	top: 10px;
	right: 10px;
	background: none;
	border: none;
	font-size: 20px;
	cursor: pointer;
	color: #1d3d6b;
`;

function PrevotingFailModal({ show, onClose, message }: AlertModalProps) {
	if (!show) return null;

	const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	return (
		<AlertModalBackground onClick={onClose}>
			<AlertModalContainer onClick={handleContainerClick}>
				<AlertModalCloseIcon onClick={onClose}>X</AlertModalCloseIcon>
				<AlertModalMessage>{message}</AlertModalMessage>
				<AlertModalButton onClick={onClose}>확인</AlertModalButton>
			</AlertModalContainer>
		</AlertModalBackground>
	);
}

export default PrevotingFailModal;
