import { api } from '$lib/api';
import type { ChatState, Conversation, MessagePayload } from '$lib/types/chat';
import { derived, writable } from 'svelte/store';

const initialState: ChatState = {
	chats: [],
	activeChatId: null,
	isLoading: false,
	error: null,
	isSending: false,
	conversations: [],
	conversation: null
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

				// update((s) => ({
				// 	...s,
				// 	conversation: {
				// 		...s.conversation,
				// 		messages: [
				// 			...s.conversation.messages,
				// 			{
				// 				id: 0,
				// 				content: message,
				// 				role: 'USER',
				// 				createdAt: new Date().toISOString()
				// 			}
				// 		]
				// 	}
				// }));
			}

			try {
				const { data } = await api.post('/chat/message', payload);
				console.log(data);
				update((state) => ({
					...state,
					chats: [...state.chats, data.data.message]
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
					conversations: data.data
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
					conversation: data.data
				}));
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				update((state) => ({ ...state, isLoading: false }));
			}
		}
	};
}

export const chatStore = createChatStore();

export const chats = derived(chatStore, ($chatStore) => $chatStore.conversations);
export const messages = derived(chatStore, ($chatStore) => $chatStore.conversation?.messages);
export const sendingMessage = derived(chatStore, ($chatStore) => $chatStore.isSending);
