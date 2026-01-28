export type Goto = typeof import('$app/navigation').goto;

type ChatStore = {
	getSingleConversation: (conversationId: number) => Promise<boolean>;
};

export async function routeToChatAndClose(options: {
	chatId: number;
	goto: Goto;
	chatStore: ChatStore;
	onClose: (v: boolean) => void;
}) {
	await options.goto(`/${options.chatId}`);
	const success = await options.chatStore.getSingleConversation(options.chatId);
	if (success) {
		options.onClose(false);
	}
}
