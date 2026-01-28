import type { Readable } from 'svelte/store';
import type { Message } from '$lib/types/chat';

export type Goto = typeof import('$app/navigation').goto;

type AuthStore = Readable<{ accessToken: string | null }>;
type InitialMessageStore = Readable<string | null>;

type ChatStore = {
	sendMessage: (payload: { message: string; conversationId: number }) => Promise<unknown>;
	setInitialMessage: (message: string | null) => void;
	getSingleConversation: (conversationId: number) => Promise<boolean>;
	setMessages: (messages: Message[]) => void;
};

export function setupChatPageEffect(options: {
	auth: AuthStore;
	initialMessage: InitialMessageStore;
	browser: boolean;
	goto: Goto;
	chatStore: ChatStore;
	chatId: number;
}) {
	const authUnsub = options.auth.subscribe(($auth) => {
		if (options.browser && !$auth.accessToken) {
			options.goto('/guest');
		}
	});

	const unsubscribe = options.initialMessage.subscribe((message) => {
		if (message) {
			options.chatStore.sendMessage({
				message,
				conversationId: options.chatId
			});
			options.chatStore.setInitialMessage(null);
		}
	});

	return () => {
		unsubscribe();
		authUnsub();
	};
}

export async function loadConversationOrRedirect(options: {
	chatId: number;
	chatStore: ChatStore;
	goto: Goto;
}) {
	try {
		const ok = await options.chatStore.getSingleConversation(options.chatId);
		if (!ok) await options.goto('/');
	} catch {
		await options.goto('/');
	}
}
