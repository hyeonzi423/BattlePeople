import { ServerData } from "@/types/openvidu";

declare module "openvidu-browser" {
	interface Connection {
		serverData?: ServerData;
	}
}
