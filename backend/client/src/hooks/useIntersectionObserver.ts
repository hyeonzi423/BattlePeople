import { useState, useEffect, useRef } from "react";

const useIntersectionObserver = (options: IntersectionObserverInit) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isIntersecting, setIntersecting] = useState<boolean>(false);
	const hasLoaded = useRef(false);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (!hasLoaded.current && entry.isIntersecting) {
				setIntersecting(entry.isIntersecting);
				hasLoaded.current = true;
			}
		}, options);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				observer.unobserve(ref.current);
			}
		};
	}, [options]);

	return { ref, isIntersecting };
};

export default useIntersectionObserver;
