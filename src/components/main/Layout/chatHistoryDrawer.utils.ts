type Set<T> = (v: T) => void;

type ChatStore = {
	deleteSingleConversation: (conversationId: number) => Promise<unknown>;
};

export function openDeleteConfirm(
	id: number,
	setDeletingId: Set<number | null>,
	setIsAlertOpen: Set<boolean>,
	setOpenMenuId: Set<number | null>
) {
	setDeletingId(id);
	setIsAlertOpen(true);
	setOpenMenuId(null);
}

export async function deleteSingleConversation(chatStore: ChatStore, conversationId: number) {
	await chatStore.deleteSingleConversation(conversationId);
}
