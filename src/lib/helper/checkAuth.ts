import { isAuthenticated } from '$lib/stores/authStore';
import { get } from 'svelte/store';

export function isUserLoggedIn(): boolean {
	const isLoggedIn = get(isAuthenticated);

	if (!isLoggedIn) {
		return false;
	}
	return true;
}
