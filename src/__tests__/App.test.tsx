import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "@/App";

describe("App.tsx Rendering Test", () => {
	it('App.tsx shows "Vite + React"', async () => {
		render(<App />);
		expect(await screen.findByText(/Vite \+ React/i)).toBeInTheDocument();
	});

	it("should increment count on button click", async () => {
		render(<App />);
		const button = screen.getByRole("button", { name: /count is/i });
		expect(button).toHaveTextContent("count is 0");
		button.click();
		await waitFor(() => expect(button).toHaveTextContent("count is 1"));
	});
});
