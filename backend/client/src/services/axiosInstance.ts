import { useAuthStore } from "@/stores/userAuthStore";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	retry?: boolean;
}
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
	baseURL,
	timeout: 3000,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

const onRequest = (
	config: CustomAxiosRequestConfig,
): CustomAxiosRequestConfig => {
	return config;
};

axiosInstance.interceptors.request.use(onRequest);

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error?: Error) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(undefined);
		}
	});

	failedQueue = [];
};

const onResponseError = (error: AxiosError | Error) => {
	const { logout } = useAuthStore.getState();

	if (axios.isAxiosError(error)) {
		const originalRequest = error.config! as CustomAxiosRequestConfig;

		if (
			error.response?.status === 401 &&
			originalRequest.url &&
			originalRequest.url!.includes("/auth/refresh")
		) {
			axiosInstance.delete("/auth/logout").finally(() => {
				logout();
				toast.error("세션이 만료되어 로그아웃 되었습니다.", {
					autoClose: 1000,
				});
			});
			return Promise.reject(new Error("세션이 만료되어 로그아웃되었습니다"));
		}

		if (error.response?.status === 401 && !originalRequest.retry) {
			originalRequest.retry = true;

			if (isRefreshing) {
				// Refresh 요청이 진행 중이면 큐에 추가하고 대기
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						return axiosInstance(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			isRefreshing = true;

			return new Promise((resolve, reject) => {
				axiosInstance
					.post("/auth/refresh")
					.then(() => {
						processQueue();
						resolve(axiosInstance(originalRequest));
					})
					.catch((err) => {
						processQueue(err);
						logout(); // 실패하면 로그아웃
						reject(err);
					})
					.finally(() => {
						isRefreshing = false;
					});
			});
		}
	}
	console.log(`🚨 [API] | Error ${error.message}`);
	return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
	(response) => response,
	onResponseError,
);

// Axios 인스턴스 익스포트
export default axiosInstance;
