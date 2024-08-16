import { LoremIpsum } from "lorem-ipsum";
import {
	BalanceGameResponse,
	BattleResponse,
	PageableResponse,
} from "@/types/api";
import { Battle, BattleWaitingParticipant } from "@/types/battle";
import { OpinionWithPercentage } from "@/types/vote";
import { BasicUserInfo } from "@/types/user";
import { FinishedLiveBattleDetail, LiveBattleCardInfo } from "@/types/live";

const lorem = new LoremIpsum();

const generateSentences = (sentenceNum: number = 1, length: number = 16) => {
	const title = lorem.generateSentences(sentenceNum);
	return title.substring(0, length);
};

const generateInteger = (max: number = 1000) => {
	return Math.floor(Math.random() * max);
};

const generateDate = (offset?: number) => {
	return (offset ? new Date(Date.now() + offset) : new Date()).toISOString();
};

const generateBoolean = (possibleProbability: number = 0.5) => {
	return Math.random() <= possibleProbability;
};

export const generateBasicUser = (): BasicUserInfo => {
	return {
		id: generateInteger(3000),
		imgUrl: "img/default",
		nickname: lorem.generateWords(2),
	};
};

export const generatePageableResponse = <T>(
	content: T[],
	page: number,
	size: number,
	totalElements: number,
): PageableResponse<T[]> => {
	const totalPages = Math.ceil(totalElements / size);
	return {
		content,
		pageable: "INSTANCE",
		last: page >= totalPages,
		totalPages,
		totalElements,
		first: page === 1,
		numberOfElements: content.length,
		size,
		number: page,
		sort: {
			empty: false,
			sorted: true,
			unsorted: false,
		},
		empty: content.length === 0,
	};
};

const generateBattle = (id: number, category?: number): Battle => ({
	id,
	registUser: generateBasicUser(),
	oppositeUser: generateBasicUser(),
	voteInfo: {
		id: generateInteger(10000),
		title: generateSentences(),
		startDate: generateDate(),
		endDate: generateDate(86400000),
		category: category || (generateInteger(10) % 7) + 1,
		detail: lorem.generateSentences(2),
	},
	minPeopleCount: 2,
	maxPeopleCount: 10,
	registDate: generateDate(),
	currentState: generateInteger(3),
	imageUrl: generateBoolean() ? lorem.generateWords(1) : undefined,
});

const generateOpinion = (
	index: number,
	totalCount: number,
	count: number,
): OpinionWithPercentage => ({
	index,
	opinion: lorem.generateSentences(1).substring(0, 16),
	count,
	percentage: Math.round((count / totalCount) * 100),
});

function generateOpinions(...counts: number[]): OpinionWithPercentage[] {
	const totalCount = counts.reduce((sum, count) => sum + count, 0);

	const opinions = counts.map((count, index) =>
		generateOpinion(index, totalCount, count),
	);

	const totalPercentage = opinions.reduce(
		(acc, curr) => acc + curr.percentage,
		0,
	);

	if (totalPercentage !== 100) {
		const maxIndex = opinions.reduce(
			(maxIdx, curr, idx, arr) =>
				curr.percentage > arr[maxIdx].percentage ? idx : maxIdx,
			0,
		);

		opinions[maxIndex].percentage = Math.max(
			0,
			opinions[maxIndex].percentage + (100 - totalPercentage),
		);
	}

	return opinions;
}

export const generateBattleResponse = (
	id: number,
	category?: number,
): BattleResponse => {
	const count1 = generateInteger(100);
	const count2 = generateInteger(100);

	return {
		battle: generateBattle(id, category),
		opinions: generateOpinions(count1, count2),
	};
};

export const generateBattleWaitingParticipant =
	(): BattleWaitingParticipant => {
		const maxPeopleCount = generateInteger(100) + 5;
		const currentPeopleCount = generateInteger(maxPeopleCount - 1);
		const count1 = generateInteger(100);
		const count2 = generateInteger(100);

		return {
			id: generateInteger(),
			title: generateSentences(),
			opinions: generateOpinions(count1, count2),
			startDate: generateDate(),
			endDate: generateDate(86400000),
			maxPeopleCount,
			currentPeopleCount,
			isVoted: generateBoolean(),
		};
	};

export const generateBalanceGameResponse = (
	category: number,
	status: number,
	id: number = generateInteger(1000),
): BalanceGameResponse => {
	const count1 = generateInteger(100);
	const count2 = 100 - count1; // Ensure that the sum of percentages is 100
	const userVote = Math.random() > 0.5 ? 0 : 1;

	return {
		id,
		opinions: generateOpinions(count1, count2),
		detail: lorem.generateSentences(2),
		currentState: status,
		userVote: generateBoolean() ? userVote : undefined,
		title: generateSentences(),
		startDate: generateDate(),
		endDate: generateDate(86400000),
		category,
	};
};

export const generateLiveBattleCard = (
	category: number,
	battleId: number = generateInteger(7),
): LiveBattleCardInfo => {
	return {
		id: battleId,
		category,
		startDate: generateDate(),
		endDate: generateDate(86400000),
		registerUser: { ...generateBasicUser(), opinion: generateSentences(1, 16) },
		oppositeUser: { ...generateBasicUser(), opinion: generateSentences(1, 16) },
		roomId: generateInteger().toString(),
		title: generateSentences(1, 16),
		currentPeopleCount: generateInteger(),
		imageUri: "https://picsum.photos/400/400",
	};
};

export const generateFinishedLiveBattleResponse = (
	battleId: number,
	category: number,
): FinishedLiveBattleDetail => {
	const finalPercentageA = generateInteger(100);
	const prePercentageA = generateInteger(100);
	return {
		id: battleId,
		title: generateSentences(1, 16),
		category,
		registerUser: { ...generateBasicUser(), opinion: generateSentences(1, 16) },
		oppositeUser: { ...generateBasicUser(), opinion: generateSentences(1, 16) },
		preResult: {
			percentageRegisterOpinion: prePercentageA,
			percentageOppositeOpinion: 100 - finalPercentageA,
		},
		preResultCount: {
			percentageRegisterOpinion: generateInteger(100),
			percentageOppositeOpinion: generateInteger(100),
		},
		finalResult: {
			percentageRegisterOpinion: finalPercentageA,
			percentageOppositeOpinion: 100 - finalPercentageA,
		},
		finalResultCount: {
			percentageRegisterOpinion: generateInteger(100),
			percentageOppositeOpinion: generateInteger(100),
		},
		imageUri: "https://picsum.photos/400/400",
		summary: generateSentences(3, 1000),
	};
};
