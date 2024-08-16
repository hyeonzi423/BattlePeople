/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from "react";
import NotificationModal from "@/components/Notification/NotificationModal";
import {
	Notification,
	NotificationLiveDetail,
	NotificationInviteDetail,
} from "@/types/notification";

interface NotificationItemProps {
	notification: Notification;
	onDelete: (id: number) => void;
	onViewDetail: (
		id: number,
	) => Promise<NotificationLiveDetail | NotificationInviteDetail | null>;
	onSendAcceptOrDecline: (
		battleId: number,
		respond: string,
		content: string,
	) => Promise<boolean>;
}

function NotificationItem({
	notification,
	onDelete,
	onViewDetail,
	onSendAcceptOrDecline,
}: NotificationItemProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [notificationDetail, setNotificationDetail] = useState<
		NotificationLiveDetail | NotificationInviteDetail | null
	>(null);

	const handleDelete = (id: number) => {
		setIsDeleting(true);
		setTimeout(() => {
			onDelete(id);
		}, 300);
	};

	const handleModalOpen = async () => {
		try {
			const detail = await onViewDetail(notification.id); // 상세 정보 가져오기
			if (detail) {
				setNotificationDetail(detail);
				setIsModalOpen(true);
			}
		} catch (error) {
			console.error("Failed to load notification detail:", error);
		}
	};

	return (
		<div>
			<div
				className={`flex justify-between items-center p-4 mx-4
					border-solid border-royalBlue border-b-2 transition-transform 
					duration-300 ease-in-out ${isDeleting ? "transform -translate-x-full" : ""} 
					${notification.read ? "bg-gray-200" : "bg-white"}`} // 조건부 배경색 클래스
			>
				<div className="cursor-pointer" onClick={handleModalOpen}>
					{notification.title}
				</div>
				<button
					type="button"
					onClick={() => handleDelete(notification.id)}
					className="text-royalBlue"
				>
					X
				</button>
			</div>
			{isModalOpen && notificationDetail && (
				<NotificationModal
					isModalOpen={isModalOpen}
					onModalClose={() => setIsModalOpen(false)}
					onDelete={onDelete}
					onSendAcceptOrDecline={onSendAcceptOrDecline}
					detail={notificationDetail} // 상세 정보 전달
				/>
			)}
		</div>
	);
}

export default NotificationItem;
