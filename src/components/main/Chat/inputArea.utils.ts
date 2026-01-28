import type { Message } from '$lib/types/chat';

export const MAX_CHAT_UPLOAD_BYTES = 5 * 1024 * 1024;

export function getDots(count: number): string {
	return '.'.repeat(count);
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 B';
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const value = (bytes / Math.pow(1024, i)).toFixed(2);
	return `${value} ${sizes[i]}`;
}

export function getAccessTokenFromStorage(): string | null {
	try {
		return typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
	} catch {
		return null;
	}
}

export function validateChatUploadFile(
	file: File,
	maxBytes: number = MAX_CHAT_UPLOAD_BYTES
): string | null {
	if (file.size > maxBytes) return 'File size limit is 5MB';
	return null;
}

export function buildUserMessage(content: string, selectedFile: File | null): Message {
	const msg: Message = {
		id: new Date().getTime(),
		role: 'USER',
		content: content.trim(),
		createdAt: new Date().toISOString()
	};

	if (selectedFile) {
		msg.attachments = [
			{
				originalFileName: selectedFile.name,
				fileSize: selectedFile.size,
				fileType: selectedFile.type
			}
		];
	}

	return msg;
}

export function withoutLastMessage<T>(arr: T[]): T[] {
	return arr.slice(0, -1);
}
