import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/userAuthStore";

const useRequireAuth = () => {
	const navigate = useNavigate();
	const { isLogin } = useAuthStore();

	useEffect(() => {
		if (!isLogin) {
			toast.error("로그인이 필요합니다", { autoClose: 1000 });
			navigate("/login");
		}
	}, [isLogin, navigate]);

	return { isLogin };
};

export default useRequireAuth;
