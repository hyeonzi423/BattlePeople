import { create } from "zustand";
import { DetailUserInfo } from "@/types/user";

interface AuthState {
	isLogin: boolean;
	user: DetailUserInfo | null;
}

interface AuthAction {
	login: (user: DetailUserInfo) => void;
	logout: () => void;
	setUser: (user: DetailUserInfo | null) => void;
}

export const useAuthStore = create<AuthState & AuthAction>((set) => ({
	isLogin: false,
	user: null,
	login: (user: DetailUserInfo) => {
		set({ isLogin: true, user });
		localStorage.setItem("user", JSON.stringify({ user }));
	},
	logout: () => {
		set({ isLogin: false, user: null });
		localStorage.removeItem("user");
	},
	setUser: (user: DetailUserInfo | null) => {
		set({ user });
		const storedUser = localStorage.getItem("user");
		let expireAt = new Date(Date.now() + 3600).toISOString();
		if (storedUser) {
			expireAt = JSON.parse(storedUser).expireAt;
		}
		localStorage.setItem("user", JSON.stringify({ user, expireAt }));
	},
}));

// 페이지가 새로고침될 때 유저 정보를 세션 스토리지에서 가져와서 상태를 갱신
const storedUser = localStorage.getItem("user");
if (storedUser) {
	const { user } = JSON.parse(storedUser);
	if (new Date() < new Date(user.accessExpiration)) {
		useAuthStore.getState().login(user);
	} else {
		localStorage.removeItem("user");
	}
}
