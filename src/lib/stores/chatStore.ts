import { api } from '$lib/api';
import type { ChatState, Conversation, Message, MessagePayload } from '$lib/types/chat';
import { derived, writable } from 'svelte/store';

const initialState: ChatState = {
	chats: [],
	activeChatId: null,
	isLoading: false,
	error: null,
	isSending: false,
	conversations: [],
	conversation: null,
	messages: [],
	allResumes: []
};

function createChatStore() {
	const { subscribe, update } = writable<ChatState>(initialState);
	return {
		subscribe,

		// Send Message
		sendMessage: async ({
			message,
			createNewConversation = false,
			conversationId
		}: MessagePayload) => {
			update((state) => ({ ...state, isSending: true }));

			const payload: MessagePayload = {
				message,
				createNewConversation
			};
			if (conversationId) {
				payload.conversationId = conversationId;
			}

			try {
				const { data } = await api.post('/chat/message', payload);
				console.log(data);

				const newMessage: Message = {
					id: new Date().getTime(),
					content: data.data.message,
					role: 'ASSISTANT',
					createdAt: new Date().toISOString()
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

		// Get Conversations
		getConversations: async ({ activeOnly }: { activeOnly?: boolean }) => {
			update((state) => ({ ...state, isLoading: true }));

			const params = activeOnly ? '?activeOnly=true' : '';

			try {
				const { data } = await api.get<{ data: Conversation[] }>('/chat/conversations' + params);
				update((state) => ({
					...state,
					conversations: data.data ?? []
				}));
			} catch (error) {
				console.log(error);
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
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				update((state) => ({ ...state, isLoading: false }));
			}
		},

		uploadResume: async (file: File) => {
			const resume = new FormData();
			resume.append('file', file);

			try {
				const { data } = await api.post('/resume/upload', resume);
				console.log(data);
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

		// set messages
		setMessages: (messages: Message[]) => {
			update((state) => ({
				...state,
				messages: messages
			}));
		}
	};
}

export const chatStore = createChatStore();

export const chats = derived(chatStore, ($chatStore) => $chatStore.conversations);
export const messages = derived(chatStore, ($chatStore) => $chatStore.messages);
export const sendingMessage = derived(chatStore, ($chatStore) => $chatStore.isSending);
export const resumes = derived(chatStore, ($chatStore) => $chatStore.allResumes);
