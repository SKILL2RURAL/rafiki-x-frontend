export function canRenewSubscription(isCancelled: boolean, endDate?: string | null): boolean {
	if (!isCancelled || !endDate) return false;
	const end = new Date(endDate);
	return end > new Date();
}

export function formatSubscriptionEndDate(endDate?: string | null): string | null {
	if (!endDate) return null;
	return new Date(endDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}
