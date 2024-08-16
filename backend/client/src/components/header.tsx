import { MouseEvent, MouseEventHandler, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import profileIcon from "@/assets/images/profile.png";
import searchIcon from "@/assets/images/search.png";
import notificationIcon from "@/assets/images/notification.png";
import brandIcon from "@/assets/images/Logo.png";
import helpIcon from "@/assets/images/help.png";
import ManualModal from "@/components/Modal/ManualModal";
import { useAuthStore } from "@/stores/userAuthStore";
import { authService } from "@/services/userAuthService";
import { useNotifySocket } from "@/hooks/useNotifySocket";

interface DropDownMenuItem {
	link: string;
	text: string;
	onClick?: MouseEventHandler;
}

interface RightHeaderProps {
	onHelpClick: () => void; // Define onHelpClick as a function that returns void
}

export function ProfileBtn() {
	const { isLogin, user } = useAuthStore();
	const navigator = useNavigate();
	const doLogout = async (event: MouseEvent) => {
		event.preventDefault();

		navigator("/");

		try {
			await authService.logout();
		} catch (err) {
			console.error("로그아웃 실패");
		}
	};

	const dropdownBeforeLogin: DropDownMenuItem[] = [
		{ link: "/login", text: "로그인" },
		{ link: "/join", text: "회원가입" },
	];

	const dropdownAfterLogin: DropDownMenuItem[] = [
		{ link: "/my-page", text: "마이페이지" },
		{ link: "/", text: "로그아웃", onClick: doLogout },
	];

	const menuItems = isLogin ? dropdownAfterLogin : dropdownBeforeLogin;

	return (
		<Menu as="div" className="relative inline-block text-left">
			<MenuButton className="inline-flex justify-center text-sm font-semibold text-gray-900 shadow-sm hover:scale-105">
				<img
					className="w-8 h-8 rounded-full"
					src={user?.imgUrl || profileIcon}
					alt="프로필 이미지"
				/>
			</MenuButton>

			<MenuItems
				anchor="bottom end"
				transition
				className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
			>
				<div className="py-1">
					{menuItems.map((item) => (
						<MenuItem key={item.link}>
							<Link
								to={item.link}
								onClick={item.onClick}
								className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
							>
								{item.text}
							</Link>
						</MenuItem>
					))}
				</div>
			</MenuItems>
		</Menu>
	);
}

function Logo() {
	return (
		<Link
			to="/"
			className="flex items-center no-underline hover:text-white text-white text-2xl font-[BMHANNA\\_11yrs] space-x-2 mr-8 lg:mr-16 whitespace-nowrap"
		>
			<img className="h-[35px]" src={brandIcon} alt="로고" />
			<span>배틀의 민족</span>
		</Link>
	);
}

function LeftHeader() {
	return (
		<>
			<Logo />
			<div className="flex space-x-4 lg:space-x-8 text-white text-lg whitespace-nowrap ml-4">
				<Link className="text-white hover:text-gray-400" to="/firework">
					불구경
				</Link>
				<Link className="text-white hover:text-gray-400" to="/fanning">
					부채질
				</Link>
				<Link className="text-white hover:text-gray-400" to="/bonfire">
					모닥불
				</Link>
			</div>
		</>
	);
}

function SearchBar() {
	return (
		<div className="text-base relative w-full max-w-[300px] lg:max-w-96 h-[35px] flex items-center bg-[#fff] border-[2px] border-solid border-[#fff] rounded-[10px] mt-4 sm:mt-0">
			<input
				type="text"
				className="w-full h-full pl-4 pr-10 bg-transparent border-none outline-none"
				placeholder="검색"
			/>
			<img
				className="absolute right-2 w-5 h-5"
				src={searchIcon}
				alt="검색 아이콘"
			/>
		</div>
	);
}

function RightHeader({ onHelpClick }: RightHeaderProps) {
	const { isLogin } = useAuthStore();

	return (
		<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end space-x-2 lg:space-x-4 w-full max-w-screen-sm ml-auto">
			{false && <SearchBar />}
			<button
				type="button"
				onClick={onHelpClick}
				className="block text-sm text-gray-700"
			>
				<img src={helpIcon} alt="Help" className="w-6 h-6 sm:w-8 sm:h-8" />
			</button>

			<div className="flex items-center justify-center space-x-4 mt-4 sm:mt-1">
				{isLogin && (
					<Link
						to="/notification"
						className="block text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
					>
						<button type="button" className="btn hover:scale-105">
							<img className="w-8 h-8" src={notificationIcon} alt="알림 버튼" />
						</button>
					</Link>
				)}
				<ProfileBtn />
			</div>
		</div>
	);
}

function Header() {
	useNotifySocket();

	const [isManualModalOpen, setIsManualModalOpen] = useState(false);

	const openModal = () => setIsManualModalOpen(true);
	const closeModal = () => setIsManualModalOpen(false);
	return (
		<div className="fixed top-0 left-0 w-full h-auto sm:h-[68px] bg-[#000] overflow-hidden z-50 overflow-x-auto">
			<div className="flex flex-col sm:flex-row items-center h-full px-4 lg:px-8">
				<LeftHeader />
				<RightHeader onHelpClick={openModal} />
			</div>
			{isManualModalOpen && <ManualModal onClose={closeModal} />}
		</div>
	);
}

export default Header;
