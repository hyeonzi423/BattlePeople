import { http, HttpResponse, PathParams } from "msw";
import { JoinRequest, ApiResponse } from "@/types/api";
import { DetailUserInfo } from "@/types/user";

export const handlers = [
	http.post<PathParams, JoinRequest>(
		"/battle-people/user/join",
		async ({ request }) => {
			const { email } = await request.json();
			if (email === "test@email.com") {
				return HttpResponse.json<ApiResponse<string>>(
					{
						code: "fail",
						data: "이미 가입된 이메일",
					},
					{ status: 400 },
				);
			}

			return HttpResponse.json<ApiResponse<string>>({
				code: "success",
				data: "가입 완료",
			});
		},
	),
	http.get("/battle-people/user/profile", () => {
		const body: ApiResponse<DetailUserInfo> = {
			code: "success",
			data: {
				id: 1,
				email: "test@email.com",
				nickname: "testUser",
				imgUrl: "test/url",
			},
		};
		return HttpResponse.json(body);
	}),
	http.get<PathParams>(
		"/battle-people/user/profile/:userId",
		async ({ params }) => {
			const { userId } = params;
			if (userId === "1") {
				const body: ApiResponse<DetailUserInfo> = {
					code: "success",
					data: {
						id: 1,
						email: "test1.email.com",
						nickname: "testUser1",
						imgUrl: "test1/url",
					},
				};
				return HttpResponse.json(body);
			}
			if (userId === "2") {
				const body: ApiResponse<DetailUserInfo> = {
					code: "success",
					data: {
						id: 2,
						email: "test2.email.com",
						nickname: "testUser2",
						imgUrl: "test2/url",
					},
				};
				return HttpResponse.json(body);
			}
			return HttpResponse.json<ApiResponse<string>>(
				{
					code: "fail",
					data: "사용자를 찾을 수 없습니다",
				},
				{ status: 404 },
			);
		},
	),
];
