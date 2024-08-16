import styled from "styled-components";
import { LiveStatus } from "@/types/Board/liveStatus";

interface RadioButtonGroupProps {
	statuses: LiveStatus[];
	selectedStatus: LiveStatus;
	onStatusSelect: (status: LiveStatus) => void;
}

const RadioButtonsContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	border-radius: 1rem;
`;

const RadioButton = styled.div<{ selected: boolean }>`
	position: relative;
	display: inline-block;
	cursor: pointer;
	padding: 0.5rem;
	transition: all 0.3s ease;
`;

const RadioButtonLabel = styled.label`
	position: relative;
	display: inline-block;
	padding-left: 2rem;
	margin-bottom: 0;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
`;

const RadioButtonInput = styled.input`
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
	cursor: pointer;
`;

const RadioButtonCustom = styled.span`
	position: absolute;
	top: 50%;
	left: 0.5rem;
	transform: translateY(-50%);
	width: 1rem;
	height: 1rem;
	border: 2px solid #333;
	border-radius: 50%;
	transition: all 0.3s ease;
`;

const RadioButtonCustomChecked = styled(RadioButtonCustom)`
	background-color: #f66c23;
	border-color: #f66c23;

	&::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0.5rem;
		height: 0.5rem;
		background-color: #fff;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}
`;

function RadioButtonGroup({
	statuses,
	selectedStatus,
	onStatusSelect,
}: RadioButtonGroupProps) {
	const getStatusLabel = (status: LiveStatus) => {
		// 수정된 부분
		if (status === "live") {
			return "실시간";
		}
		if (status === "upcoming") {
			return "예정된";
		}
		return "종료된";
	};

	return (
		<RadioButtonsContainer>
			{statuses.map((status) => (
				<RadioButton
					key={status}
					selected={selectedStatus === status}
					onClick={() => onStatusSelect(status)}
				>
					<RadioButtonLabel htmlFor={status}>
						<RadioButtonInput
							id={status}
							type="radio"
							name="status"
							value={status}
							checked={selectedStatus === status}
							readOnly
						/>
						{selectedStatus === status ? (
							<RadioButtonCustomChecked />
						) : (
							<RadioButtonCustom />
						)}
						{getStatusLabel(status)}
					</RadioButtonLabel>
				</RadioButton>
			))}
		</RadioButtonsContainer>
	);
}

export default RadioButtonGroup;
