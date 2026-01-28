import { browser } from '$app/environment';

export function getInitialSidebarOpen(): boolean {
	if (!browser) return false;
	return localStorage.getItem('isSidebarOpen') === 'true';
}

export function toggleSidebarOpen(current: boolean): boolean {
	const next = !current;
	if (browser) {
		localStorage.setItem('isSidebarOpen', JSON.stringify(next));
	}
	return next;
}
