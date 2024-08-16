import classNames from "classnames";
import { ChangeEventHandler, MouseEventHandler, KeyboardEvent } from "react";

interface AuthSubmitBtnProps {
	text: string;
	onClick: MouseEventHandler;
	className?: string;
}

interface AuthInputProps {
	label: string;
	name: string;
	type: string;
	placeholder: string;
	value: string;
	onChange: ChangeEventHandler;
	className?: string;
	error?: string; // 에러 메시지 추가
	// eslint-disable-next-line react/require-default-props
	onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function AuthInput({
	label,
	name,
	type,
	placeholder,
	value,
	onChange,
	className,
	error, // 에러 메시지 추가
	onKeyDown,
}: AuthInputProps) {
	return (
		<div className="mb-4">
			<label htmlFor={name} className="block text-black mb-2">
				{label}
				<input
					id={name}
					name={name}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onKeyDown={onKeyDown}
					className={classNames(
						"w-full p-2 border-4 border-black rounded-xl focus:outline-none focus:border-[#F66C23] focus:shadow-[0_0_0_3px_rgba(246,108,35,0.3)]",
						className,
					)}
				/>
				{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
				{/* 에러 메시지 표시 */}
			</label>
		</div>
	);
}

export function AuthSubmitBtn({
	text,
	onClick,
	className,
}: AuthSubmitBtnProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={classNames(
				"w-full h-13 p-2 bg-black text-white text-2xl rounded-2xl mt-4 hover:bg-[#F66C23]",
				className,
			)}
		>
			{text}
		</button>
	);
}

AuthInput.defaultProps = {
	className: "",
	error: "", // 에러 메시지 기본값 추가
};

AuthSubmitBtn.defaultProps = {
	className: "",
};
