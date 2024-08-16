/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				orange: "#F66C23",
				blue: "#0B68EC",
				yellow: "#FBCA27",
				olive: "#B4CC38",
				royalBlue: "#1D3D6B",
			},
			scale: {
				"120": "1.2",
			},
			height: {
				"116": "28rem", // ?px
				"128": "32rem", // 512px
				"144": "36rem", // 576px
				"150": "38rem",
				"160": "39rem", // 640px
				"192": "48rem", // 768px
				"224": "56rem", // 896px
				"70%": "70%",
			},
		},
	},
	plugins: [
		require("tailwind-scrollbar-hide"),
		function ({ addUtilities }) {
			const videoCrop = {
				".clip-path-left": {
					clipPath: "polygon(0 0, 100% 0, 79% 100%, 0 100%)",
				},
				".clip-path-right": {
					clipPath: "polygon(21% 0, 100% 0, 100% 100%, 0 100%)",
				},
			};
			addUtilities(videoCrop);
		},
	],
};
