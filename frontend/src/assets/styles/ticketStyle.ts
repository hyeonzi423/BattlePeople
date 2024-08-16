import styled, { css } from "styled-components";

export const TicketContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 16px;
	margin: 8px;
	width: 600px;
	position: relative;
	${({ theme }) => css`
		background-color: ${theme.backgroundColor};
		color: white;
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	`}
`;

export const TicketContent = styled.div`
	flex: 1;
	padding-right: 16px;
`;

export const TicketTitle = styled.div`
	font-size: 14px;
	margin-bottom: 8px;
	${({ theme }) => css`
		color: ${theme.titleColor};
	`}
`;

export const EventDetails = styled.div`
	padding: 16px;
	margin-bottom: 8px;
	${({ theme }) => css`
		border: 3px solid ${theme.borderColor};
		background-color: ${theme.backgroundColor};
	`}
`;

export const EventTitle = styled.div`
	font-size: 24px;
	${({ theme }) => css`
		color: ${theme.textColor};
	`}
	margin-bottom: 8px;
`;

export const EventSubtitle = styled.div`
	font-size: 18px;
	${({ theme }) => css`
		color: ${theme.textColor};
	`}
	margin-bottom: 8px;
`;

export const EventTime = styled.div`
	font-size: 14px;
	${({ theme }) => css`
		color: ${theme.textColor};
	`}
`;

export const BarcodeContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-left: 16px;
	margin-top: 18px;
`;

export const BarcodeImage = styled.img`
	height: 40px;
	width: 64px;
	margin-bottom: 20px;
`;

export const AttendButton = styled.div<{ disabled?: boolean }>`
	border-radius: 9999px;
	padding: 4px 16px;
	margin-bottom: 8px;
	cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
	${({ theme }) => css`
		background-color: ${theme.buttonBackgroundColor};
		color: ${theme.buttonColor};
	`}
`;

export const AttendCount = styled.div`
	font-size: 14px;
	${({ theme }) => css`
		color: ${theme.attendeeCountColor};
	`}
`;

export const Divider = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: calc(100% - 100px);
	width: 2px;
	background: repeating-linear-gradient(
		to bottom,
		transparent,
		transparent 4px,
		#fff 4px,
		#fff 8px
	);
`;
