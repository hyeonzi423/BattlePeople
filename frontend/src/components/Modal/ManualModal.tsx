import { useState } from "react";
import styled from "styled-components";
import {
	ModalBackdrop,
	ManualModalContent,
	ModalHeader,
	ModalTitle,
	CloseButton,
	ModalBody,
} from "@/assets/styles/modalStyles";
import fireIcon from "@/assets/images/fire.gif";
import windIcon from "@/assets/images/Wind.gif";
import bonfireIcon from "@/assets/images/bonfire.gif";
import loveMessage from "@/assets/images/loveMessage.gif";
import user from "@/assets/images/user.gif";

const tabTitles = ["불구경", "부채질", "모닥불", "마이페이지"];

export const ContentWrapper = styled.div`
	padding: 30px;
	background-color: #ffffff;
	border-radius: 8px;
	margin-bottom: 1rem;
	border: 4px solid #000000;
	height: 330px;
`;

export const StyledH3 = styled.h3`
	display: flex;
	align-items: center;
	font-size: 1.5rem;
	margin-bottom: 1rem;
`;

export const StyledP = styled.p`
	font-size: 1.1rem;
	margin-bottom: 1rem;
	line-height: 1.5;
`;

export const StyledOl = styled.ol`
	margin-left: 1.5rem;
	margin-bottom: 1rem;
	list-style: decimal;
`;

export const StyledLi = styled.li`
	margin-bottom: 0.5rem;
	font-size: 1rem;
`;

interface ModalProps {
	onClose: () => void;
}

function BattleManualModal({ onClose }: ModalProps) {
	const [activeTab, setActiveTab] = useState<number>(0);

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLButtonElement>,
		index: number,
	) => {
		if (event.key === "Enter" || event.key === " ") {
			setActiveTab(index);
		}
	};

	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	return (
		<ModalBackdrop onClick={handleBackdropClick}>
			<ManualModalContent borderColor="#000000">
				<ModalHeader>
					<ModalTitle>배틀의 민족 사용 설명서</ModalTitle>
					<CloseButton borderColor="#000000" onClick={onClose}>
						X
					</CloseButton>
				</ModalHeader>
				<ModalBody>
					<ul className="flex justify-center items-center my-4">
						{tabTitles.map((tab, index) => (
							<li key={tab} style={{ listStyle: "none" }}>
								<button
									type="button"
									onClick={() => setActiveTab(index)}
									onKeyDown={(event) => handleKeyDown(event, index)}
									style={{
										cursor: "pointer",
										padding: "10px",
										color: activeTab === index ? "#F66C23" : "#000",
										borderBottom:
											activeTab === index ? "2px solid #F66C23" : "none",
										background: "none",
										border: "none",
										fontSize: "1.2rem",
									}}
									aria-pressed={activeTab === index}
								>
									{tab}
								</button>
							</li>
						))}
					</ul>

					<div>
						{activeTab === 0 && (
							<ContentWrapper>
								<StyledH3>
									<img
										src={fireIcon}
										alt="불구경 아이콘"
										style={{ width: "35px", marginRight: "8px" }}
									/>
									불구경
								</StyledH3>
								<StyledP>
									지금 이 순간, 전장 한복판에서 벌어지는 뜨거운 라이브 토론
									현장을 실시간으로 구경할 수 있는 게시판입니다.
								</StyledP>
								<StyledH3>
									<img
										src={loveMessage}
										alt="이용방법 아이콘"
										style={{ width: "35px", marginRight: "8px" }}
									/>
									이용 방법
								</StyledH3>
								<StyledOl>
									<StyledLi>[불구경] 메뉴를 터치하세요.</StyledLi>
									<StyledLi>
										진행중, 예정된, 종료된 라이브 토론 목록이 뜹니다.
									</StyledLi>
									<StyledLi>
										구경하고 싶은 라이브를 골라 토론에 참여하거나, 라이브 카드
										클릭시 상세 정보를 볼 수 있어요!
									</StyledLi>
								</StyledOl>
							</ContentWrapper>
						)}
						{activeTab === 1 && (
							<ContentWrapper>
								<StyledH3>
									<img
										src={windIcon}
										alt="부채질 아이콘"
										style={{ width: "35px", marginRight: "8px" }}
									/>
									부채질
								</StyledH3>
								<StyledP>
									토론 대결을 원하는 주제를 미리 확인하고, 사전 투표를 통해 사전
									예약을 할 수 있는 게시판입니다.
								</StyledP>
								<StyledH3>
									<img
										src={loveMessage}
										alt="이용방법 아이콘"
										style={{ width: "35px", marginRight: "8px" }}
									/>
									이용 방법
								</StyledH3>
								<StyledOl>
									<StyledLi>[부채질] 메뉴를 눌러보세요.</StyledLi>
									<StyledLi>
										곧 펼쳐질 라이브 토론 목록이 쫘르르 펼쳐집니다.
									</StyledLi>
									<StyledLi>
										마음에 드는 주제를 골라 사전 투표 & 참석 신청을 완료하세요.
									</StyledLi>
								</StyledOl>
							</ContentWrapper>
						)}
						{activeTab === 2 && (
							<ContentWrapper>
								<StyledH3>
									<img
										src={bonfireIcon}
										alt="모닥불 아이콘"
										style={{ width: "35px", marginRight: "8px" }}
									/>
									모닥불
								</StyledH3>
								<StyledP>
									이곳은 각종 밸런스 게임이 벌어지는 장소입니다. 간단한 주제,
									진지한 고민 가리지 말고 올려보세요!
								</StyledP>
								<StyledH3>
									<img
										src={loveMessage}
										alt="이용방법 아이콘"
										style={{ width: "35px", marginRight: "8px" }}
									/>
									이용 방법
								</StyledH3>
								<StyledOl>
									<StyledLi>[모닥불] 메뉴를 클릭!</StyledLi>
									<StyledLi>다양한 주제의 밸런스 게임이 등장합니다.</StyledLi>
									<StyledLi>
										투표에 참여하고, 결과를 확인하며 다른 이들의 의견을
										들어보세요!
									</StyledLi>
								</StyledOl>
							</ContentWrapper>
						)}
						{activeTab === 3 && (
							<ContentWrapper>
								<StyledH3>
									<img
										src={user}
										alt="마이페이지 아이콘"
										style={{ width: "35px", marginRight: "8px" }}
									/>
									마이페이지
								</StyledH3>
								<StyledP>
									프로필 이미지를 클릭하여 마이페이지에 접속해보세요. 승률,
									개최한 라이브, 참여한 투표를 조회하고, 관심사를 등록할 수
									있어요!
								</StyledP>
								<StyledH3>
									<img
										src={loveMessage}
										alt="이용방법 아이콘"
										style={{ width: "35px", marginRight: "8px" }}
									/>
									이용 방법
								</StyledH3>

								<StyledLi>
									참여한 투표: 승/패/무를 통해 간편하게 내가 참여한 투표의
									결과를 확인하세요.
								</StyledLi>
								<StyledLi>
									관심사: 관심사를 등록하고 메인에서 먼저 확인 할 수 있어요.
								</StyledLi>
							</ContentWrapper>
						)}
					</div>
				</ModalBody>
			</ManualModalContent>
		</ModalBackdrop>
	);
}

export default BattleManualModal;
