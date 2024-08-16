import { useEffect, useState } from "react";
import ModalContent from "@/components/Modal/ModalContent";
import ModalForm from "@/components/Modal/ModalForm";
import { liveBattleService } from "@/services/liveBattleService";
import { WaitingLiveBattleDetail } from "@/types/live";

interface UpcomingLivePreviewModalProps {
	battleId: number;
	onClose: () => void;
}

function UpcomingLivePreviewModal({
	battleId,
	onClose,
}: UpcomingLivePreviewModalProps) {
	const [data, setData] = useState<WaitingLiveBattleDetail | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await liveBattleService.getWaitDetail(
					battleId.toString(),
				);
				setData(response.data!); // API 응답 데이터를 그대로 상태에 저장
			} catch (error) {
				console.error("Failed to fetch waiting live battle detail:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [battleId]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!data) {
		return <div>데이터를 불러오지 못했습니다.</div>;
	}

	return (
		<ModalForm
			title="예정된 라이브 미리보기"
			infoText={data.title}
			onClose={onClose}
			borderColor="#0b68ec"
			summary={data.summary || "상세정보가 없습니다."}
		>
			<ModalContent
				registerUser={{
					nickname: data.registerUser.nickname,
					imgUrl: data.registerUser.imgUrl || "",
					opinion: data.registerUser.opinion || "",
				}}
				oppositeUser={{
					nickname: data.oppositeUser.nickname,
					imgUrl: data.oppositeUser.imgUrl || "",
					opinion: data.oppositeUser.opinion || "",
				}}
				speechBubbleColor="#0b68ec"
				status="upcoming"
			/>
		</ModalForm>
	);
}

export default UpcomingLivePreviewModal;
