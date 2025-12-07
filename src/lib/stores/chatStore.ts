import { api } from '$lib/api';
import type { ChatState, Conversation, Message, MessagePayload } from '$lib/types/chat';
import axios, { AxiosError } from 'axios';
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
	allResumes: [],
	initialMessage: null,
	isTranscribing: false,
	isRecording: false,
	isUploadingVoiceNote: false,
	newMessage: ''
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
				const { data } = await axios.post(
					'http://ec2-51-21-61-45.eu-north-1.compute.amazonaws.com:8080/api/voice/note',
					formData,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('accessToken')}`
						}
					}
				);
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
				const { data } = await axios.post(
					'http://ec2-51-21-61-45.eu-north-1.compute.amazonaws.com:8080/api/upload',
					formData,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('accessToken')}`
						}
					}
				);
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
			update((state) => ({
				...state,
				messages: messages
			}));
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
