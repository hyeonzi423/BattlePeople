import {
	EndedLivePreviewModalType,
	UpcomingLivePreviewModalType,
	User,
	Result,
} from "@/types/Board/modalTypes";

const sampleUser: User = {
	id: 0,
	nickname: "string",
	imgUrl: "https://picsum.photos/400/400",
	opinion: "string",
};

const sampleResult: Result = {
	percentageRegisterOpinion: 50,
	percentageOppositeOpinion: 50,
};

export const endedLivePreviewModalData: EndedLivePreviewModalType = {
	id: 0,
	title: "종료된 라이브 미리보기",
	registerUser: sampleUser,
	oppositeUser: sampleUser,
	preResult: sampleResult,
	finalResult: sampleResult,
	category: "example category",
	imageUri: "https://picsum.photos/400/400",
	summary: "종료된 라이브 토론 내용 요약",
};

export const upcomingLivePreviewModalData: UpcomingLivePreviewModalType = {
	id: 0,
	roomId: "string",
	title: "예정된 라이브 미리보기",
	registerUser: sampleUser,
	oppositeUser: sampleUser,
	startDate: "2024-07-29T01:13:21.816Z",
	endDate: "2024-07-29T01:13:21.816Z",
	currentPeopleCount: 100,
	category: "example category",
	imageUri: "https://picsum.photos/400/400",
	battleRule: "example rule",
	summary: "예정된 라이브 토론의 상세 정보가 들어갑니다.",
};
