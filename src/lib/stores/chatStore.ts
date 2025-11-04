import { api } from '$lib/api';
import type { ChatState, MessagePayload } from '$lib/types/chat';
import { writable } from 'svelte/store';

const initialState: ChatState = {
	chats: [],
	activeChatId: null,
	isLoading: false,
	error: null,
	isSending: false
};

function createChatStore() {
	const { subscribe, update } = writable<ChatState>(initialState);
	return {
		subscribe,

		// Send Message
		sendMessage: async ({ message, createNewConversation = false }: MessagePayload) => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				const { data } = await api.post('/chat/send-message', { message, createNewConversation });
				console.log(data);
				update((state) => ({
					...state,
					isLoading: false,
					chats: [...state.chats, data.data.message]
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
