export interface Message {
	id?: number;
	role: 'USER' | 'ASSISTANT';
	content: string;
	createdAt: string;
	chatContext?: ChatContext | null;
	tokenCount?: string | null;
	isTyping?: boolean;
	feedback?: 'LIKE' | 'DISLIKE' | null;
	feedbackText?: string | null;
	feedbackAt?: string | null;
	attachments?: {
		originalFileName: string | undefined;
		fileSize: number | undefined;
		fileType: string | undefined;
	}[];
}

export type ChatContext = 'INTERVIEW_PREP' | 'STORY';

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
	allResumes: Resume[];
	initialMessage: string | null;
	isUploadingVoiceNote: boolean;
	isRecording: boolean;
	isTranscribing: boolean;
	newMessage: string;
	guestSessionId: string | null;
	guestRemainingMessages: number | null;
}

export interface Resume {
	id: number;
	fileName: string;
	fileUrl: string;
	fileSize: number;
	status: string;
	uploadedAt: string;
	isDefault: boolean;
}

export interface MessagePayload {
	message: string;
	createNewConversation?: boolean;
	conversationId?: number;
	fileKeys?: string[];
	chatContext?: ChatContext | null;
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
