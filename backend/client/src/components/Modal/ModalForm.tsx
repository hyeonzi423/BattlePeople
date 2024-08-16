import React from "react";
import "@/assets/styles/scrollbar.css";
import styled from "styled-components";
import {
	ModalBackdrop,
	ModalContent,
	ModalHeader,
	ModalTitle,
	CloseButton,
	ModalBody,
	InfoText,
	InfoTextSpan,
	TitleText,
} from "@/assets/styles/modalStyles";

interface ModalFormProps {
	title: string;
	infoText: string;
	summary: string;
	onClose: () => void;
	children: React.ReactNode;
	borderColor: string;
}

const CustomModalContent = styled(ModalContent)<{ borderColor: string }>`
	border: 8px solid ${({ borderColor }) => borderColor};
`;

function ModalForm({
	title,
	infoText,
	summary,
	onClose,
	children,
	borderColor,
}: ModalFormProps) {
	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	return (
		<ModalBackdrop onClick={handleBackdropClick}>
			<CustomModalContent borderColor={borderColor}>
				<ModalHeader>
					<ModalTitle>{title}</ModalTitle>
					<CloseButton
						type="button"
						onClick={onClose}
						borderColor={borderColor}
					>
						X
					</CloseButton>
				</ModalHeader>
				<ModalBody>
					<TitleText borderColor={borderColor}>{infoText}</TitleText>
					{children}
					<InfoText borderColor={borderColor} className="custom-scrollbar">
						<InfoTextSpan>{summary}</InfoTextSpan>
					</InfoText>
				</ModalBody>
			</CustomModalContent>
		</ModalBackdrop>
	);
}

export default ModalForm;
