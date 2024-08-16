import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthInput, AuthSubmitBtn } from "@/components/auth/AuthFormComponent";
import { authService } from "@/services/userAuthService";
import "@/assets/styles/shake.css";
import { JoinRequest } from "@/types/api";
import { createLiveStateBorder } from "@/utils/textBorder"; // textBorder import

function SignUpPage() {
	const navigator = useNavigate();
	const [formValues, setFormValues] = useState<JoinRequest>({
		email: "",
		password: "",
		nickname: "",
	});
	const [passwordConfirm, setPasswordConfirm] = useState<string>("");
	const [errors, setErrors] = useState({
		email: "",
		nickname: "",
		password: "",
		passwordConfirm: "",
	});
	const [doShake, setDoShake] = useState<boolean>(false);

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string) => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
		return passwordRegex.test(password);
	};

	const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		if (name === "nickname" && value.length > 12) {
			return;
		}

		setFormValues({
			...formValues,
			[name]: value,
		});

		let errorMsg = "";

		switch (name) {
			case "email":
				if (!validateEmail(value)) {
					errorMsg = "유효한 이메일 형식이 아닙니다.";
				} else {
					try {
						const isEmailAvailable =
							await authService.checkEmailAvailability(value);
						if (!isEmailAvailable) {
							errorMsg = "이미 사용 중인 이메일입니다.";
						}
					} catch (error) {
						errorMsg = "이메일 중복 확인 중 오류가 발생했습니다.";
					}
				}
				break;
			case "nickname":
				if (value) {
					try {
						const isNicknameAvailable =
							await authService.checkNicknameAvailability(value);
						if (!isNicknameAvailable) {
							errorMsg = "이미 사용 중인 닉네임입니다.";
						}
					} catch (error) {
						errorMsg = "닉네임 중복 확인 중 오류가 발생했습니다.";
					}
				}
				break;
			case "password":
				if (!validatePassword(value)) {
					errorMsg = "8~16자 영문 대소문자, 숫자를 포함해야 합니다.";
				}
				break;
			case "passwordConfirm":
				if (value !== formValues.password) {
					errorMsg = "비밀번호가 일치하지 않습니다.";
				}
				break;
			default:
				break;
		}

		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: errorMsg,
		}));
	};

	const handlePasswordConfirmChange = (
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const { value } = event.target;
		setPasswordConfirm(value);
		if (value !== formValues.password) {
			setErrors((prevErrors) => ({
				...prevErrors,
				passwordConfirm: "비밀번호가 일치하지 않습니다.",
			}));
		} else {
			setErrors((prevErrors) => ({
				...prevErrors,
				passwordConfirm: "",
			}));
		}
	};

	const doJoin = async () => {
		const hasErrors = Object.values(errors).some((error) => error !== "");
		const hasEmptyFields =
			Object.values(formValues).some((value) => value === "") ||
			passwordConfirm === "";

		if (hasErrors || hasEmptyFields) {
			setErrors({
				email:
					formValues.email === "" ? "이메일을 입력해주세요." : errors.email,
				nickname:
					formValues.nickname === ""
						? "닉네임을 입력해주세요."
						: errors.nickname,
				password:
					formValues.password === ""
						? "비밀번호를 입력해주세요."
						: errors.password,
				passwordConfirm:
					passwordConfirm === ""
						? "비밀번호 확인을 입력해주세요."
						: errors.passwordConfirm,
			});
			setDoShake(true);
			setTimeout(() => {
				setDoShake(false);
			}, 500);
			return;
		}

		try {
			// TODO: 비밀번호 규칙 검사
			await authService.join(formValues);
			navigator("/");
		} catch (err) {
			console.error("회원가입 실패");
			setDoShake(true);
			setTimeout(() => {
				setDoShake(false);
			}, 500);
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-white">
			<div
				className="bg-white p-8 rounded-3xl shadow-lg scale-100"
				style={{ border: "4px solid black" }}
			>
				<h1
					className="text-center text-white text-5xl mb-4"
					style={createLiveStateBorder("black", 4)} // textShadow 스타일 적용
				>
					회원가입
				</h1>
				<form>
					<div className="mb-4 relative">
						<AuthInput
							label="이메일"
							type="email"
							name="email"
							value={formValues.email}
							onChange={handleInputChange}
							placeholder="이메일을 입력해주세요."
						/>
						{errors.email && (
							<div className="text-red-500 text-xs absolute right-0 top-0 mt-1 mr-2">
								{errors.email}
							</div>
						)}
					</div>
					<div className="mb-4 relative">
						<AuthInput
							label="닉네임"
							type="text"
							name="nickname"
							value={formValues.nickname}
							onChange={handleInputChange}
							placeholder="닉네임을 입력해주세요."
						/>
						{errors.nickname && (
							<div className="text-red-500 text-xs absolute right-0 top-0 mt-1 mr-2">
								{errors.nickname}
							</div>
						)}
					</div>
					<div className="mb-4 relative">
						<AuthInput
							label="비밀번호"
							type="password"
							name="password"
							value={formValues.password}
							onChange={handleInputChange}
							placeholder="8~16자 영문 대소문자, 숫자 포함."
						/>
						{errors.password && (
							<div className="text-red-500 text-xs absolute right-0 top-0 mt-1 mr-2">
								{errors.password}
							</div>
						)}
					</div>
					<div className="mb-4 relative">
						<AuthInput
							label="비밀번호 확인"
							type="password"
							name="passwordConfirm"
							value={passwordConfirm}
							onChange={handlePasswordConfirmChange}
							placeholder="비밀번호 확인"
						/>
						{errors.passwordConfirm && (
							<div className="text-red-500 text-xs absolute right-0 top-0 mt-1 mr-2">
								{errors.passwordConfirm}
							</div>
						)}
					</div>
					<div id="submit-btn">
						<AuthSubmitBtn
							text="확인"
							onClick={doJoin}
							className={doShake ? "shake" : ""}
						/>
					</div>
				</form>
				<div className="flex justify-between mt-4">
					<Link
						to="/login"
						className="text-black hover:color hover:text-[#F66C23]"
					>
						#로그인
					</Link>
					<Link to="/" className="text-black hover:color hover:text-[#F66C23]">
						#홈으로 이동
					</Link>
				</div>
			</div>
		</div>
	);
}

export default SignUpPage;
