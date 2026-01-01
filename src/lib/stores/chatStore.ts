import { api } from '$lib/api';
import type { ChatState, Conversation, Message, MessagePayload } from '$lib/types/chat';
import { AxiosError } from 'axios';
import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';

// Load guestSessionId from localStorage if available
const getStoredGuestSessionId = (): string | null => {
	if (browser && typeof localStorage !== 'undefined') {
		return localStorage.getItem('guest_session_id');
	}
	return null;
};

const initialState: ChatState = {
	chats: [],
	activeChatId: null,
	isLoading: false,
	error: null,
	isSending: false,
	conversations: [],
	conversation: null,
	messages: [],
	allResumes: [],
	initialMessage: null,
	isTranscribing: false,
	isRecording: false,
	isUploadingVoiceNote: false,
	newMessage: '',
	guestSessionId: getStoredGuestSessionId(),
	guestRemainingMessages: null
};

function createChatStore() {
	const { subscribe, update } = writable<ChatState>(initialState);
	return {
		subscribe,

		setInitialMessage: (message: string | null) => {
			update((state) => ({ ...state, initialMessage: message }));
		},

		setIsSending: (isSending: boolean) => {
			update((state) => ({ ...state, isSending }));
		},

		setIsTranscribing: (isTranscribing: boolean) => {
			update((state) => ({ ...state, isTranscribing }));
		},

		setIsRecording: (isRecording: boolean) => {
			update((state) => ({ ...state, isRecording }));
		},

		setNewMessage: (message: string) => {
			update((state) => ({ ...state, newMessage: message }));
		},

		// Send Message
		sendMessage: async ({
			message,
			createNewConversation = false,
			conversationId,
			fileKeys
		}: MessagePayload) => {
			update((state) => ({ ...state, isSending: true }));

			const payload: MessagePayload = {
				message,
				createNewConversation
			};

			// Check if conversationId is defined
			if (conversationId) {
				payload.conversationId = conversationId;
			}

			// Check if fileKeys is defined
			if (fileKeys) {
				payload.fileKeys = fileKeys;
			}

			try {
				const { data } = await api.post('/chat/message', payload);

				const newMessage: Message = {
					id: new Date().getTime(),
					content: data.data.message,
					role: 'ASSISTANT',
					createdAt: new Date().toISOString(),
					isTyping: true
				};
				update((state) => ({
					...state,
					chats: [...state.chats, data.data.message],
					messages: [...state.messages, newMessage]
				}));
				return data.data;
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				update((state) => ({ ...state, isSending: false }));
			}
		},

		// Send Guest Message
		sendGuestMessage: async (message: string) => {
			let sessionId: string | null = null;
			let hasExistingMessages = false;

			// Get current sessionId from store state and check if this is a new conversation
			update((state) => {
				sessionId = state.guestSessionId;
				// If messages array has more than 1 message, we're continuing an existing conversation
				// (messages should have at least 1 USER and 1 ASSISTANT message from previous exchanges)
				hasExistingMessages = state.messages.length > 1;
				return { ...state, isSending: true };
			});

			try {
				// Prepare headers - only send sessionId if continuing an existing conversation
				// Don't send sessionId on the first message of a new conversation
				const headers: Record<string, string> = {};
				if (sessionId && hasExistingMessages) {
					headers['X-Guest-Session-Id'] = sessionId;
				}

				const { data } = await api.post('/chat/guest/message', { message }, { headers });

				// Save sessionId to localStorage and update state
				const newSessionId = data.data.sessionId ?? sessionId;
				if (newSessionId && browser && typeof localStorage !== 'undefined') {
					localStorage.setItem('guest_session_id', newSessionId);
				}

				const assistant: Message = {
					id: new Date().getTime(),
					content: data.data.aiMessage,
					role: 'ASSISTANT',
					createdAt: new Date().toISOString(),
					isTyping: true
				};
				update((state) => ({
					...state,
					messages: [...state.messages, assistant],
					guestRemainingMessages: data.data.remainingMessages ?? state.guestRemainingMessages,
					guestSessionId: newSessionId
				}));
				return data.data;
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				update((state) => ({ ...state, isSending: false }));
			}
		},

		// Get Conversations
		getConversations: async ({ activeOnly }: { activeOnly?: boolean }) => {
			const token =
				typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
			if (!token) {
				update((state) => ({ ...state, conversations: [], isLoading: false }));
				return;
			}
			update((state) => ({ ...state, isLoading: true }));

			const params = activeOnly ? '?activeOnly=true' : '';

			try {
				const { data } = await api.get<{ data: Conversation[] }>('/chat/conversations' + params);
				update((state) => ({
					...state,
					conversations: data.data ?? []
				}));
			} catch (error) {
				if (error instanceof AxiosError) {
					console.log('Axios error ->', error);
				}
				throw error;
			} finally {
				update((state) => ({ ...state, isLoading: false }));
			}
		},

		// Get Conversation by ID
		getSingleConversation: async (id: number) => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				const { data } = await api.get<{ data: Conversation }>(`/chat/conversations/${id}`);
				update((state) => ({
					...state,
					conversation: data.data,
					messages: data.data.messages ?? []
				}));
				return true;
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				update((state) => ({ ...state, isLoading: false }));
			}
		},

		sendVoiceNote: async (file: File) => {
			const formData = new FormData();
			formData.append('audio', file);
			formData.append('language', 'en-US');

			try {
				const { data } = await api.post('/voice/note', formData);
				if (data.transcription && data.transcription.length > 0) {
					return data.transcription;
				}
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		uploadFileForChat: async (file: File) => {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('folder', 'chat');

			try {
				const { data } = await api.post('/upload', formData);
				if (data.data) {
					return data.data;
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		uploadResume: async (file: File) => {
			const resume = new FormData();
			resume.append('file', file);

			try {
				const { data } = await api.post('/resume/upload', resume);
				if (data.data) {
					return data.data;
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		getAllResumes: async () => {
			try {
				const { data } = await api.get('/resume/list');
				update((s) => ({
					...s,
					allResumes: data.data || []
				}));
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		deleteResume: async (id: number) => {
			try {
				const { data } = await api.delete(`/resume/${id}`);
				if (data.success) {
					return true;
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		// FUNCTION TO DELETE A SINGLE CONVERSATION
		deleteSingleConversation: async (conversationId: number) => {
			try {
				const { data } = await api.delete(`/chat/conversations/${conversationId}`);
				if (data.success) {
					update((state) => ({
						...state,
						conversations: state.conversations.filter((c) => c.id !== conversationId),
						...(state.conversation?.id === conversationId
							? { conversation: null, messages: [] }
							: {})
					}));
					return true;
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		// FUNCTION TO DELETE ALL CONVERSATIONS
		deleteAllConversations: async () => {
			try {
				const { data } = await api.delete('/chat/conversations');
				if (data.success) {
					update((state) => ({
						...state,
						conversations: [],
						conversation: null,
						messages: []
					}));
					return data.data as number;
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		// Submit feedback for a message
		submitMessageFeedback: async (
			messageId: number,
			payload: { feedbackType: 'LIKE' | 'DISLIKE'; feedbackText: string }
		) => {
			update((state) => ({
				...state,
				messages: state.messages.map((m) =>
					m.id === messageId ? { ...m, feedback: payload.feedbackType } : m
				)
			}));

			try {
				const { data } = await api.post(`/chat/messages/${messageId}/feedback`, payload);

				if (data.success && data.data) {
					const returned = data.data as Message;
					update((state) => ({
						...state,
						messages: state.messages.map((m) =>
							m.id === messageId
								? {
										...m,
										feedback: returned.feedback ?? payload.feedbackType,
										feedbackText: returned.feedbackText ?? payload.feedbackText,
										feedbackAt: returned.feedbackAt ?? new Date().toISOString()
									}
								: m
						)
					}));
					return true;
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},

		// set messages
		setMessages: (messages: Message[]) => {
			update((state) => {
				// If setting messages to a new array with 1 or fewer messages, it's a new conversation
				// Clear the sessionId so we don't send it on the first message
				const isNewConversation = messages.length <= 1 && state.messages.length > 1;
				return {
					...state,
					messages: messages,
					// Clear sessionId when starting a new conversation
					...(isNewConversation
						? {
								guestSessionId: null,
								guestRemainingMessages: null
							}
						: {})
				};
			});

			// Also clear from localStorage when starting a new conversation
			if (messages.length <= 1 && browser && typeof localStorage !== 'undefined') {
				localStorage.removeItem('guest_session_id');
			}
		},

		// Set message typing status
		setMessageTypingStatus: (messageId: number, isTyping: boolean) => {
			update((state) => ({
				...state,
				messages: state.messages.map((msg) => (msg.id === messageId ? { ...msg, isTyping } : msg))
			}));
		}
	};
}

export const chatStore = createChatStore();

export const chats = derived(chatStore, ($chatStore) => $chatStore.conversations);
export const messages = derived(chatStore, ($chatStore) => $chatStore.messages);
export const sendingMessage = derived(chatStore, ($chatStore) => $chatStore.isSending);
export const resumes = derived(chatStore, ($chatStore) => $chatStore.allResumes);
export const initialMessage = derived(chatStore, ($chatStore) => $chatStore.initialMessage);
export const isRecording = derived(chatStore, ($chatStore) => $chatStore.isRecording);
export const isTranscribing = derived(chatStore, ($chatStore) => $chatStore.isTranscribing);
export const newMessage = derived(chatStore, ($chatStore) => $chatStore.newMessage);
export const isLoadingChats = derived(chatStore, ($chatStore) => $chatStore.isLoading);
export const guestRemainingMessages = derived(
	chatStore,
	($chatStore) => $chatStore.guestRemainingMessages
);
