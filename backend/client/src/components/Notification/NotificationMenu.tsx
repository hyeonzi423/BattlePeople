import NotifyCode from "@/constant/notifyCode";

interface NotificationMenuProps {
	selectedMenu: number;
	onSelectMenu: (menu: number) => void;
}

function NotificationMenu({
	selectedMenu,
	onSelectMenu,
}: NotificationMenuProps) {
	return (
		<div className="border-solid border-royalBlue border-4 rounded-md text-white">
			<button
				type="button"
				className={`block w-full text-left py-2 px-4 pr-12 ${NotifyCode.get(selectedMenu) === "Notify" ? "bg-royalBlue" : "bg-white text-royalBlue"}`}
				onClick={() => onSelectMenu(-1)}
			>
				Notify
			</button>
			<button
				type="button"
				className={`block w-full text-left py-2 px-4 pr-12 ${NotifyCode.get(selectedMenu) === "Live" ? "bg-royalBlue" : "bg-white text-royalBlue"}`}
				onClick={() => onSelectMenu(1)}
			>
				Live
			</button>
			<button
				type="button"
				className={`block w-full text-left py-2 px-4 pr-12 ${NotifyCode.get(selectedMenu) === "Invite" ? "bg-royalBlue" : "bg-white text-royalBlue"}`}
				onClick={() => onSelectMenu(0)}
			>
				Invite
			</button>
			{/* <button
				type="button"
				className={`block w-full text-left py-2 px-4 pr-12 ${NotifyCode.get(selectedMenu) === "Punishment" ? "bg-royalBlue" : "bg-white text-royalBlue"}`}
				onClick={() => onSelectMenu(3)}
			>
				Punishment
			</button> */}
		</div>
	);
}

export default NotificationMenu;
