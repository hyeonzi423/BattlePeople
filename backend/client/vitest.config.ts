import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: ["./vitest.setup.ts"],
		},
	}),
);
