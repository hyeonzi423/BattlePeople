import { useState } from "react";
import styled from "styled-components";
import "@/assets/styles/scrollbar.css";

interface DropdownProps {
	options: string[];
	defaultOption: string;
	onSelect?: (option: string) => void;
}

const SelectContainer = styled.div`
	width: 100%;
	cursor: pointer;
	position: relative;
	transition: 300ms;
	color: #000000;
	overflow: visible;
	flex: 1;
`;

const Selected = styled.div<{ isOpen: boolean }>`
	background-color: #ffffff;
	padding: 12px 16px;
	border-radius: 15px;
	border: 3.5px solid ${({ isOpen }) => (isOpen ? "#f66c23" : "#000000")};
	font-size: 14px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	outline: none;
	color: #000000;
	transition: border-color 300ms;
	box-sizing: border-box; /* Ensure padding and border are included in total width */
`;

const Arrow = styled.svg<{ isOpen: boolean }>`
	height: 16px;
	width: 16px;
	fill: #000000;
	transition: 300ms;
	transform: ${({ isOpen }) => (isOpen ? "rotate(0deg)" : "rotate(-90deg)")};
	transform-origin: center;
	transform: scale(1.5)
		${({ isOpen }) => (isOpen ? "rotate(0deg)" : "rotate(-90deg)")};
`;

const Options = styled.div<{ isOpen: boolean }>`
	display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
	flex-direction: column;
	border-radius: 5px;
	padding: 5px;
	background-color: #ffffff;
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	transition: 200ms;
	z-index: 1000;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	max-height: 200px;
	overflow-y: auto;
`;

const Option = styled.div`
	border-radius: 5px;
	padding: 12px 16px;
	transition: 300ms;
	background-color: #ffffff;
	font-size: 14px;
	color: #000000;
	cursor: pointer;
	&:hover {
		background-color: #f0f0f0;
	}
`;

function Dropdown(props: DropdownProps) {
	const { options, defaultOption, onSelect } = props;
	const [selected, setSelected] = useState(defaultOption);
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (option: string) => {
		setSelected(option);
		setIsOpen(false); // Close the dropdown after selecting
		if (onSelect) {
			onSelect(option);
		}
	};

	return (
		<SelectContainer>
			<Selected onClick={toggleDropdown} isOpen={isOpen}>
				{selected}
				<Arrow viewBox="0 0 24 24" isOpen={isOpen}>
					<path d="M7 10l5 5 5-5z" />
				</Arrow>
			</Selected>
			<Options isOpen={isOpen} className="custom-scrollbar">
				{options.map((option) => (
					<Option key={option} onClick={() => handleSelect(option)}>
						{option}
					</Option>
				))}
			</Options>
		</SelectContainer>
	);
}

Dropdown.defaultProps = {
	onSelect: () => {}, // No operation function
};

export default Dropdown;
