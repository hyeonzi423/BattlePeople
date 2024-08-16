import styled from "styled-components";

export const Form = styled.form`
	margin-top: 16px;
	max-width: 800px;
	margin: 0 auto;
`;

export const FormGroup = styled.div`
	margin-top: 13px;
	display: flex;
	flex-direction: column;
`;

export const FlexFormGroup = styled.div`
	margin-top: 13px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 15px;
`;

export const Label = styled.label`
	color: #000000;
	margin-bottom: 8px;
	font-size: 17px;
	display: block;
`;

export const Input = styled.input`
	border-radius: 15px;
	border: 3.5px solid #000000;
	padding: 12px 16px;
	color: #000000;
	font-size: 14px;
	outline: none;
	flex: 1;
	box-sizing: border-box;

	&:focus {
		border-color: #f66c23;
	}
`;

export const TextArea = styled.textarea`
	width: 100%;
	border-radius: 15px;
	border: 3.5px solid #000000;
	color: #000000;
	padding: 12px 16px;
	font-size: 14px;
	outline: none;
	box-sizing: border-box;

	&:focus {
		border-color: #f66c23;
	}
`;

export const ButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
`;

export const Button = styled.button`
	margin-top: 16px;
	background-color: #000000;
	color: white;
	border-radius: 15px;
	padding: 8px 16px;
	cursor: pointer;
	border: none;

	&:hover {
		background-color: #f66c23;
	}
`;

export const ErrorLabel = styled.span`
	color: #f66c23;
	font-size: 0.8rem;
	margin-left: 8px;
`;
