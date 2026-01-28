type Toast = { success: (msg: string) => void; error: (msg: string) => void };

export async function copyWithToast(text: string, toast: Toast) {
	try {
		await navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard');
	} catch {
		toast.error('Failed to copy');
	}
}
