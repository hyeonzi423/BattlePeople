import { useEffect, useState } from "react";
import { CircularProgressBar } from "@tomickigrzegorz/react-circular-progress-bar";
import { authService, UserWinHistory } from "@/services/userAuthService"; // authService에서 getLoginUserWinHistory 가져오기
import empty from "@/assets/images/empty.png";

function WinRate() {
	const [winHistory, setWinHistory] = useState<UserWinHistory | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchWinHistory = async () => {
			try {
				const history = await authService.getLoginUserWinHistory();
				setWinHistory(history);
			} catch (error) {
				setError("Failed to load win history");
			} finally {
				setLoading(false);
			}
		};

		fetchWinHistory();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return (
			<div style={{ textAlign: "center", fontSize: "x-large" }}>
				{/* <div>{error}</div> */}
				<img
					src={empty}
					alt="Error"
					style={{
						marginLeft: 25,
						marginTop: -30,
						width: "200px",
						height: "200px",
					}}
				/>
				<span>조회된 내역이 없습니다.</span>
			</div>
		);
	}

	if (!winHistory) {
		return null;
	}

	const styles = {
		winRate: {
			textAlign: "center" as const,
			marginTop: "20px",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		winRateCircle: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			margin: "20px 20px 20px 0",
		},
		winRateDetails: {
			listStyle: "none" as const,
			padding: 0,
			fontSize: "18px",
			textAlign: "left" as const,
			marginLeft: "20px",
		},
		winRateDetailsItem: {
			margin: "5px 0",
		},
	};

	return (
		<div style={styles.winRate}>
			<div style={styles.winRateCircle}>
				<CircularProgressBar
					colorCircle="#ededed"
					colorSlice="#1D3D6B"
					percent={winHistory.winRate}
					fontColor="#1D3D6B"
					round
					fontSize="20px"
					textPosition="0.35em"
				/>
			</div>
			<ul style={styles.winRateDetails}>
				<li style={styles.winRateDetailsItem}>
					참여한 토론의 수 : {winHistory.debateCnt}
				</li>
				<li style={styles.winRateDetailsItem}>
					승리한 토론의 수 : {winHistory.winCnt}
				</li>
				<li style={styles.winRateDetailsItem}>
					패배한 토론의 수 : {winHistory.loseCnt}
				</li>
			</ul>
		</div>
	);
}

export default WinRate;
