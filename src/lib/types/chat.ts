export interface Message {
	id?: number;
	role: 'USER' | 'ASSISTANT';
	content: string;
	createdAt: string;
	tokenCount?: string | null;
}

export interface Chat {
	id: string;
	title: string;
	messages: Message[];
	createdAt: string;
	updatedAt: string;
	unreadCount: number;
}

export interface ChatState {
	chats: Chat[];
	activeChatId: string | null;
	isLoading: boolean;
	error: string | null;
	isSending: boolean;
	conversations: Conversation[];
	conversation: Conversation | null;
	messages: Message[];
}

export interface MessagePayload {
	message: string;
	createNewConversation?: boolean;
	conversationId?: number;
}

export interface Conversation {
	id: number;
	title: string;
	summary: string | null;
	messageCount: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	messages: Message[] | null;
}
