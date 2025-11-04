export interface Message {
	id: string;
	text: string;
	sender: 'user' | 'ai' | 'system';
	timestamp: string;
	read?: boolean;
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
}

export interface MessagePayload {
	message: string;
	createNewConversation?: boolean;
}
