import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import router from "@/routes/router";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

if (import.meta.env.MODE === "test") {
	import("./mocks/browser").then(({ worker }) => {
		worker.start();
	});
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<>
		<RouterProvider router={router} />
		<ToastContainer />
	</>,
	// </React.StrictMode>,
);
