/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/styles/mypage.css";
import { toast } from "react-toastify";
import Header from "@/components/header";
import { authService } from "@/services/userAuthService";
import editIcon from "@/assets/images/edit.png";
import profileImagePlaceholder from "@/assets/images/default.png";
import "@/assets/styles/shake.css";
import MyPageContent from "@/components/MyPageContent";
import { useAuthStore } from "@/stores/userAuthStore";
import penIcon from "@/assets/images/pen.png";
import useRequireAuth from "@/hooks/useRequireAuth";

function MyPage() {
	useRequireAuth();

	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [isEditingNickname, setIsEditingNickname] = useState(false);
	const [errors, setErrors] = useState({ nickname: "" });
	const [doShake, setDoShake] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const formDataRef = useRef<FormData>(new FormData());
	const { user, setUser } = useAuthStore();

	useEffect(() => {
		if (!user) {
			// 로그인이 안 된 경우 로그인 페이지로 이동
			navigate("/login", { replace: true });
		}
	}, [user, navigate]);

	const [profileImage, setProfileImage] = useState<string>(
		user?.imgUrl || profileImagePlaceholder,
	);

	const [nickname, setNickname] = useState<string>(user?.nickname || "");
	const [originalNickname, setOriginalNickname] = useState<string>(
		user?.nickname || "",
	); // 원래 닉네임 저장

	const email = user?.email || "";

	const handleEditClick = () => {
		if (isEditing) {
			// Cancel을 눌렀을 때 원래 상태로 복원
			const resetImage = async () => {
				const imageUrl = user?.imgUrl;
				setProfileImage(imageUrl || profileImagePlaceholder);
			};
			resetImage();
			setErrors({ nickname: "" });
		}
		setIsEditing(!isEditing);
	};

	const handleNicknameEditClick = () => {
		setIsEditingNickname(true);
	};

	const handleNicknameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newNickname = e.target.value;

		if (newNickname.length <= 12) {
			setNickname(newNickname);
		}

		if (newNickname === originalNickname) {
			setErrors({ nickname: "" });
			return;
		}

		if (!newNickname) {
			setErrors({ nickname: "닉네임을 입력해 주세요." });
			return;
		}

		// 닉네임 중복 확인 로직
		authService.checkNicknameAvailability(newNickname).then((isAvailable) => {
			if (!isAvailable) {
				setErrors({ nickname: "이미 사용 중인 닉네임입니다." });
			} else {
				setErrors({ nickname: "" });
			}
		});
	};

	const handleNicknameSaveClick = async () => {
		if (!nickname) {
			setDoShake(true);
			setErrors({ nickname: "닉네임을 입력해 주세요." });
			setTimeout(() => setDoShake(false), 500);
			return;
		}

		if (nickname === originalNickname) {
			setIsEditingNickname(false);
			return;
		}

		if (errors.nickname) {
			setDoShake(true);
			setTimeout(() => setDoShake(false), 500);
			return;
		}

		// 닉네임 저장 로직
		try {
			await authService.updateUserProfile({ ...user!, nickname });
			setOriginalNickname(nickname); // 저장된 닉네임을 원래 닉네임으로 설정
			setIsEditingNickname(false);
			setUser({ ...user!, nickname }); // 전역 상태에 업데이트
			toast.info("닉네임이 수정되었습니다.", { autoClose: 1000 });
		} catch (error) {
			setDoShake(true);
			setTimeout(() => setDoShake(false), 500);
		}
	};

	const handleNicknameCancelClick = () => {
		setNickname(originalNickname); // 원래 닉네임으로 복구
		setErrors({ nickname: "" });
		setIsEditingNickname(false);
	};

	const handleSaveClick = async () => {
		try {
			const uploadResponse = await authService.uploadProfileImage(
				formDataRef.current,
			);
			if (uploadResponse.code === "success" && uploadResponse.data) {
				const imageUrl = uploadResponse.data!;
				setProfileImage(imageUrl || profileImagePlaceholder);
				user!.imgUrl = imageUrl;
				setUser(user);
			}

			await authService.updateUserProfile(user!);
			setIsEditing(false);
			toast.info("프로필이 저장되었습니다.", { autoClose: 1000 });
		} catch (error) {
			setDoShake(true);
			setTimeout(() => setDoShake(false), 500);
		}
	};

	const handleIconClick = () => {
		if (isEditing && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleImageError = () => {
		setProfileImage(profileImagePlaceholder);
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// 이미지 파일 형식만 허용 (예: jpg, jpeg, png, gif)
			const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
			console.log(file.type);
			if (!validImageTypes.includes(file.type)) {
				toast.error(
					"이미지 파일 형식이 아닙니다. jpg, jpeg, png, gif 형식의 파일만 업로드할 수 있습니다.",
					{ autoClose: 1500 },
				);
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
				handleImageError();
				return;
			}

			formDataRef.current.set("file", file); // formData에 파일 설정
			const reader = new FileReader();
			reader.onload = () => {
				if (reader.result) {
					setProfileImage(reader.result as string);
				}
			};
			reader.readAsDataURL(file);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div>
			<Header />
			<div className="mypage-container">
				<div className="mypage-header">
					<div className="left-section">
						<div className="profile-section">
							<div className="profile-img-container">
								<img
									className={`profile-img ${isEditing ? "darken" : ""}`}
									src={profileImage}
									alt="프로필 이미지"
									onClick={handleIconClick}
									onError={handleImageError} // 이미지 로드 오류 처리
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleIconClick();
										}
									}}
									role="button"
									tabIndex={isEditing ? 0 : -1}
								/>
								{isEditing && (
									<img
										className="edit-icon"
										src={editIcon}
										alt="편집 아이콘"
										onClick={handleIconClick}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												handleIconClick();
											}
										}}
										role="button"
										tabIndex={0}
									/>
								)}
							</div>
							<input
								type="file"
								ref={fileInputRef}
								style={{ display: "none" }}
								onChange={handleFileChange}
								accept="image/*"
							/>
							<div className="button-group">
								<button className="edit-btn" onClick={handleEditClick}>
									{isEditing ? "Cancel" : "Edit"}
								</button>
								{isEditing && (
									<button
										onClick={handleSaveClick}
										className={`save-btn ${doShake ? "shake" : ""}`}
									>
										Save
									</button>
								)}
							</div>
						</div>
					</div>
					<div className="right-section">
						<div className="profile-info">
							<label>이메일</label>
							<input type="text" value={email} readOnly />
							<label>
								닉네임
								{!isEditingNickname && ( // 닉네임 수정 중이 아닐 때만 아이콘을 표시
									<img
										className="edit-icon-small"
										src={penIcon}
										alt="닉네임 수정"
										onClick={handleNicknameEditClick}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												handleNicknameEditClick();
											}
										}}
										role="button" // 역할을 명시적으로 버튼으로 설정
										tabIndex={0} // 키보드 포커스 가능하도록 설정
									/>
								)}
							</label>
							<div className="input-with-error">
								<input
									type="text"
									name="nickname"
									value={nickname}
									onChange={handleNicknameInputChange}
									readOnly={!isEditingNickname}
									maxLength={12}
									className={isEditingNickname ? "editable" : ""}
								/>
								{isEditingNickname && (
									<div className="nickname-edit-buttons">
										<button
											onClick={handleNicknameSaveClick}
											className={`save-btn ${doShake ? "shake" : ""}`}
											style={{ backgroundColor: "#1D3D6B", color: "#fff" }}
										>
											저장
										</button>
										<button onClick={handleNicknameCancelClick}>취소</button>
									</div>
								)}
								{errors.nickname && (
									<div className="error-message">{errors.nickname}</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<MyPageContent />
			</div>
		</div>
	);
}

export default MyPage;
