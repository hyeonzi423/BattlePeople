export interface CustomCSSProperties extends React.CSSProperties {
	textShadow?: string;
}

export const createLiveStateBorder = (
	color: string,
	pixel: number,
): CustomCSSProperties => {
	const shadow = `${-pixel}px ${-pixel}px 0 ${color}, ${pixel}px ${-pixel}px 0 ${color}, ${-pixel}px ${pixel}px 0 ${color}, ${pixel}px ${pixel}px 0 ${color}`;
	return {
		textShadow: shadow,
	};
};
