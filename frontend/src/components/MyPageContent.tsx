import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "@/assets/styles/mypageContent.css";

function MyPageContent() {
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState<string>("");

	useEffect(() => {
		const tabs = [
			{ label: "Win Rate", value: "" },
			{ label: "Created Lives", value: "created-lives" },
			{ label: "Participated Votes", value: "participated-votes" },
			{ label: "Interests", value: "interests" },
		];

		const currentPath = location.pathname.split("/").pop();
		if (currentPath && tabs.some((tab) => tab.value === currentPath)) {
			setActiveTab(currentPath);
		}
	}, [location.pathname]);

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		navigate(`/my-page/${value}`);
	};

	return (
		<div className="mypage-content-container">
			<ul className="tabs-navigation" role="tablist">
				{[
					{ label: "승률", value: "" },
					{ label: "개최한 라이브", value: "created-lives" },
					{ label: "참여한 투표", value: "participated-votes" },
					{ label: "관심사", value: "interests" },
				].map(({ label, value }) => (
					<li key={value} role="presentation">
						<a
							href={`#tabs-${value}`}
							className={`tab-link ${activeTab === value ? "active" : ""}`}
							role="tab"
							aria-selected={activeTab === value}
							onClick={(e) => {
								e.preventDefault();
								handleTabChange(value);
							}}
						>
							{label}
						</a>
					</li>
				))}
			</ul>

			{/* Tabs content */}
			<div className="mypage-content">
				<Outlet /> {/* 자식 라우트에 따른 컴포넌트 렌더링 */}
			</div>
		</div>
	);
}

export default MyPageContent;
