// userAuthService.test.ts

import {
	describe,
	it,
	expect,
	beforeEach,
	beforeAll,
	afterEach,
	afterAll,
} from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers";
import { useAuthStore } from "@/stores/userAuthStore";
import { authService } from "@/services/userAuthService";

// Mock server 설정
const server = setupServer(...handlers);

beforeAll(() => {
	server.listen();
});

afterEach(() => {
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});

// 테스트 전 초기화
beforeEach(() => {
	useAuthStore.setState({ isLogin: false, user: null });
});

describe("userAuthService", () => {
	it("should login successfully", async () => {
		const loginRequest = { email: "test@email.com", password: "password" };
		const response = await authService.login(loginRequest);

		expect(response.code).toBe("success");
		expect(response.data?.email).toBe("test@email.com");

		const state = useAuthStore.getState();
		expect(state.isLogin).toBe(true);
		expect(state.user).toEqual(response.data);
	});

	it("should fail to login with incorrect credentials", async () => {
		const loginRequest = { email: "wrong.email.com", password: "password" };

		await expect(authService.login(loginRequest)).rejects.toThrow(
			"Request failed with status code 400",
		);

		const state = useAuthStore.getState();
		expect(state.isLogin).toBe(false);
		expect(state.user).toBeNull();
	});

	it("should join successfully", async () => {
		const joinRequest = {
			email: "new.email.com",
			password: "password",
			nickname: "nickname",
		};
		const response = await authService.join(joinRequest);

		expect(response.code).toBe("success");
		expect(response.data).toBe("가입 완료");
	});

	it("should fail to join with already registered email", async () => {
		const joinRequest = {
			email: "test@email.com",
			password: "password",
			nickname: "testuser",
		};

		await expect(authService.join(joinRequest)).rejects.toThrow(
			"Request failed with status code 400",
		);
	});

	it("should get user info successfully", async () => {
		// 로그인 후 사용자 정보 가져오기 테스트
		const loginRequest = { email: "test@email.com", password: "password" };
		await authService.login(loginRequest);

		const response = await authService.getUserInfo();
		expect(response.code).toBe("success");
		expect(response.data?.email).toBe("test@email.com");

		const state = useAuthStore.getState();
		expect(state.user).toEqual(response.data);
	});

	it("should get user profile successfully", async () => {
		const response = await authService.getUserInfo(1);
		expect(response.code).toBe("success");
		expect(response.data?.email).toBe("test1.email.com");
	});

	it("should return 404 for non-existing user profile", async () => {
		await expect(authService.getUserInfo(999)).rejects.toThrow(
			"Request failed with status code 404",
		);
	});

	it("should logout successfully", async () => {
		// 로그인 후 로그아웃 테스트
		const loginRequest = { email: "test@email.com", password: "password" };
		await authService.login(loginRequest);

		await authService.logout();

		const state = useAuthStore.getState();
		expect(state.isLogin).toBe(false);
		expect(state.user).toBeNull();
	});
});
