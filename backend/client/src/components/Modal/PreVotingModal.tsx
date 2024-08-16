import React from "react";
import styled from "styled-components";

interface PreVoteModalProps {
	showModal: boolean;
	setShowModal: (show: boolean) => void;
	title: string;
	opinion1: string;
	opinion2: string;
	onVote: (opinion: string) => void;
}

const PreVoteModalBackground = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
`;

const PreVoteModalContainer = styled.div`
	background-color: white;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	max-width: 400px;
	width: 100%;
	text-align: center;
	position: relative;
`;

const PreVoteModalTitle = styled.h2`
	color: #1d3d6b;
	font-size: 25px;
	margin-top: 20px;
	margin-bottom: 10px;
`;

const PreVoteModalText = styled.p`
	color: #1d3d6b;
	font-size: 15px;
	margin-bottom: 20px;
`;

const PreVoteModalVoteButton = styled.button`
	background-color: #1d3d6b;
	color: white;
	border: none;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
	margin: 5px 0;
	width: 100%;

	&:hover {
		background-color: #fbca27;
		color: #1d3d6b;
	}
`;

const PreVoteModalCloseIcon = styled.button`
	position: absolute;
	top: 10px;
	right: 10px;
	background: none;
	border: none;
	font-size: 20px;
	cursor: pointer;
	color: #1d3d6b;
`;

function PreVoteModal({
	showModal,
	setShowModal,
	title,
	opinion1,
	opinion2,
	onVote,
}: PreVoteModalProps) {
	if (!showModal) return null;

	// Handler to close modal when clicking on the background
	const handleBackgroundClick = () => {
		setShowModal(false);
	};

	// Stop click event from propagating to the background when clicking inside the modal
	const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	return (
		<PreVoteModalBackground onClick={handleBackgroundClick}>
			<PreVoteModalContainer onClick={handleContainerClick}>
				<PreVoteModalCloseIcon onClick={() => setShowModal(false)}>
					X
				</PreVoteModalCloseIcon>
				<PreVoteModalTitle>{title}</PreVoteModalTitle>
				<PreVoteModalText>투표할 내용을 선택해주세요.</PreVoteModalText>
				<PreVoteModalVoteButton onClick={() => onVote(opinion1)}>
					{opinion1}
				</PreVoteModalVoteButton>
				<PreVoteModalVoteButton onClick={() => onVote(opinion2)}>
					{opinion2}
				</PreVoteModalVoteButton>
			</PreVoteModalContainer>
		</PreVoteModalBackground>
	);
}

export default PreVoteModal;
