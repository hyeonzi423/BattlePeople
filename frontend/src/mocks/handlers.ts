import { handlers as authHandlers } from "@/mocks/auth/handler";
import { handlers as userHandlers } from "@/mocks/user/handler";
import { handlers as battleHandlers } from "@/mocks/battle/handler";
import { handlers as balancegameHandlers } from "@/mocks/balancegame/handler";
import { handlers as liveHandlers } from "@/mocks/live/handler";

export const handlers = [
	...authHandlers,
	...userHandlers,
	...battleHandlers,
	...balancegameHandlers,
	...liveHandlers,
];
