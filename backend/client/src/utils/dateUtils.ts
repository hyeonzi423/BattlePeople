import { format, toZonedTime } from "date-fns-tz";

/**
 * 주어진 ISO 날짜 문자열을 특정 시간대의 로컬 시간으로 변환하여 반환합니다.
 * @param isoString 변환할 ISO 날짜 문자열
 * @param timeZone 변환할 시간대 (예: 'America/New_York', 'Asia/Seoul')
 * @returns 변환된 로컬 시간 문자열
 */
export const convertToTimeZone = (
	isoString: string,
	timeZone: string,
): string => {
	const zonedDate = toZonedTime(isoString, timeZone);
	return format(zonedDate, "yyyy-MM-dd HH:mm", { timeZone });
};
