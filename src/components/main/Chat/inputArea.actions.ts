import { AxiosError } from 'axios';
import type { Message } from '$lib/types/chat';
import {
	buildUserMessage,
	getAccessTokenFromStorage,
	validateChatUploadFile,
	withoutLastMessage
} from './inputArea.utils';

type Toast = { error: (msg: string) => void; success: (msg: string) => void };

export function startDotCountAnimation(
	setDotCount: (n: number) => void,
	intervalMs: number = 300
): () => void {
	const dotSequence = [1, 2, 3, 4, 5, 6, 0];
	let sequenceIndex = 0;
	setDotCount(dotSequence[sequenceIndex]);

	const interval = setInterval(() => {
		sequenceIndex = (sequenceIndex + 1) % dotSequence.length;
		setDotCount(dotSequence[sequenceIndex]);
	}, intervalMs);

	return () => {
		clearInterval(interval);
		setDotCount(0);
	};
}

export async function uploadChatFileFromInputChange(options: {
	event: Event;
	toast: Toast;
	setUploading: (v: boolean) => void;
	setSelectedFile: (f: File | null) => void;
	setFileKeys: (keys: string[]) => void;
	uploadFileForChat: (file: File) => Promise<{ fileKey?: string } | null | undefined>;
	maxBytes?: number;
}) {
	options.setUploading(true);
	const target = options.event.target as HTMLInputElement;
	const resetInput = () => {
		if (target) target.value = '';
	};

	try {
		if (!target.files || target.files.length === 0) return;
		const file = target.files[0];

		const sizeError = validateChatUploadFile(file, options.maxBytes);
		if (sizeError) {
			options.toast.error(sizeError);
			options.setSelectedFile(null);
			options.setFileKeys([]);
			return;
		}

		const token = getAccessTokenFromStorage();
		if (!token) {
			options.toast.error('Please log in to upload files');
			options.setSelectedFile(null);
			options.setFileKeys([]);
			return;
		}

		options.setSelectedFile(file);

		const fileUploadResponse = await options.uploadFileForChat(file);
		if (fileUploadResponse?.fileKey) {
			options.setFileKeys([fileUploadResponse.fileKey]);
			options.toast.success('File uploaded successfully');
		} else {
			throw new Error('Invalid response from server');
		}
	} catch (error) {
		console.error('Error uploading file:', error);
		options.toast.error('Failed to upload file. Please try again.');
		options.setSelectedFile(null);
		options.setFileKeys([]);
	} finally {
		options.setUploading(false);
		resetInput();
	}
}

export async function sendChatInputMessage(options: {
	toast: Toast;
	getIsSending: () => boolean;
	getGuestRemainingMessages: () => number | null;
	onOpenCreateAccount?: () => void;
	getMessageText: () => string;
	getMessages: () => Message[];
	setMessages: (msgs: Message[]) => void;
	sendGuestMessage: (message: string) => Promise<unknown>;
	sendMessage: (payload: {
		message: string;
		createNewConversation: boolean;
		conversationId: number;
		fileKeys: string[];
	}) => Promise<unknown>;
	chatId: number;
	getSelectedFile: () => File | null;
	getFileKeys: () => string[];
	resetAfterSend: () => void;
	setShowGuestToast: (v: boolean) => void;
	refreshConversations: () => void;
}) {
	if (options.getIsSending()) return;

	const token = getAccessTokenFromStorage();

	// Guest-only gating: once the user is authenticated, don't show CreateAccountModal
	const remaining = options.getGuestRemainingMessages();
	if (!token && remaining !== null && remaining === 0 && options.onOpenCreateAccount) {
		// Clear draft text/attachments before sending user to auth
		options.resetAfterSend();
		options.onOpenCreateAccount();
		return;
	}

	const rawText = options.getMessageText();
	if (!rawText.trim()) {
		options.toast.error('Please enter a message');
		return;
	}

	const selectedFile = options.getSelectedFile();
	const fileKeys = options.getFileKeys();

	// Check if file is selected but upload failed (no fileKey)
	if (selectedFile && fileKeys.length === 0 && token) {
		options.toast.error('File upload failed. Please remove the file and try again.');
		return;
	}

	// Prevent sending files with guest messages
	if (selectedFile && !token) {
		options.toast.error('Please log in to send files');
		return;
	}

	const updatedMessage: Message[] = [...options.getMessages()];
	updatedMessage.push(buildUserMessage(rawText, selectedFile));
	options.setMessages(updatedMessage);

	if (!token) {
		await options.sendGuestMessage(rawText.trim());
		options.setShowGuestToast(true);
	} else {
		try {
			await options.sendMessage({
				message: rawText.trim(),
				createNewConversation: false,
				conversationId: options.chatId,
				fileKeys
			});
		} catch (error) {
			console.error('Error sending message:', error);
			if (error instanceof AxiosError) {
				const storedMessages = options.getMessages();
				if (storedMessages && storedMessages.length) {
					options.setMessages(withoutLastMessage(storedMessages));
				}

				options.toast.error(
					error.response?.data.message ||
						'Daily chat limit reached (5/5). Upgrade to the Support tier for unlimited access.'
				);
			}
		}
	}

	options.resetAfterSend();

	if (token) {
		options.refreshConversations();
	}
}
