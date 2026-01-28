import type { Conversation } from '$lib/types/chat';

export type ChatGroups = {
	today: Conversation[];
	yesterday: Conversation[];
	recent: Conversation[];
};

function isSameDay(d1: Date, d2: Date) {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}

export function groupChats(chatsList: Conversation[], now: Date = new Date()): ChatGroups {
	const today = now;
	const yesterday = new Date(now);
	yesterday.setDate(today.getDate() - 1);

	const groups: ChatGroups = {
		today: [],
		yesterday: [],
		recent: []
	};

	for (const chat of chatsList) {
		const date = new Date(chat.updatedAt);
		if (isSameDay(date, today)) {
			groups.today.push(chat);
		} else if (isSameDay(date, yesterday)) {
			groups.yesterday.push(chat);
		} else {
			groups.recent.push(chat);
		}
	}

	return groups;
}

export function groupChatsLimited(
	chatsList: Conversation[],
	limit: number,
	now: Date = new Date()
): ChatGroups {
	const grouped = groupChats(chatsList, now);
	let remaining = limit;

	const take = (arr: Conversation[]) => {
		const n = Math.min(arr.length, remaining);
		const res = arr.slice(0, n);
		remaining -= n;
		return res;
	};

	return {
		today: take(grouped.today),
		yesterday: remaining > 0 ? take(grouped.yesterday) : [],
		recent: remaining > 0 ? take(grouped.recent) : []
	};
}
