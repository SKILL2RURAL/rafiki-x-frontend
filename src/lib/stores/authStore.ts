import { browser } from '$app/environment';
import { api } from '$lib/api';
import { derived, get, writable, type Writable } from 'svelte/store';
import type { LoginPayload, RegisterPayload } from '../types/auth';
import { toast } from 'svelte-sonner';

// Persistent Stores
function createPersisted<T>(key: string, start: T): Writable<T> {
	let initial =
		browser && localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : start;

	// If we have a refreshToken in localStorage but not in the parsed state, add it
	if (browser && key === 'auth' && initial && !initial.refreshToken) {
		const storedRefreshToken = localStorage.getItem('refreshToken');
		if (storedRefreshToken) {
			initial = { ...initial, refreshToken: storedRefreshToken };
		}
	}

	const { subscribe, set, update } = writable(initial);

	return {
		subscribe,
		set: (v: T) => {
			if (browser) {
				localStorage.setItem(key, JSON.stringify(v));
			}
			set(v);
		},
		update: (fn: (v: T) => T) => {
			update((v) => {
				const newVal = fn(v);
				if (browser) {
					localStorage.setItem(key, JSON.stringify(newVal));
				}
				return newVal;
			});
		}
	};
}

export interface User {
	id: string;
	email: string;
	name: string;
}

export interface AuthState {
	email: string | null;
	firstName: string | null;
	accessToken: string | null;
	refreshToken: string | null;
	isLoading: boolean;
	countries: { code: string; name: string }[] | null;
	isInitialAuthCheckComplete: boolean;
}

// Core Store
const initial: AuthState = {
	email: null,
	firstName: null,
	isLoading: false,
	accessToken: null,
	refreshToken: null,
	countries: null,
	isInitialAuthCheckComplete: false
};

export const auth = createPersisted<AuthState>('auth', initial);

export const isLoading = derived(auth, ($auth) => $auth.isLoading);
export const user = derived(auth, ($auth) => ({
	email: $auth.email,
	name: $auth.firstName
}));

// Actions
export async function login(payload: LoginPayload) {
	auth.update((state) => ({ ...state, isLoading: true }));

	payload.email = payload.email.toLowerCase();

	try {
		const { data } = await api.post('/auth/login', payload);
		auth.update((state) => ({
			...state,
			email: data.data.email,
			firstName: data.data.firstName,
			accessToken: data.data.token,
			refreshToken: data.data.refreshToken || null
		}));
		if (browser) {
			localStorage.setItem('accessToken', data.data.token);
			if (data.data.refreshToken) {
				localStorage.setItem('refreshToken', data.data.refreshToken);
			}
		}
	} catch (err) {
		console.log(err);
		throw err;
	} finally {
		auth.update((state) => ({
			...state,
			isLoading: false
		}));
	}
}

export async function register(payload: RegisterPayload) {
	auth.update((state) => ({ ...state, isLoading: true }));

	try {
		const { data } = await api.post('/auth/register', payload);

		auth.update((state) => ({
			...state,
			firstName: data.data.firstName,
			email: data.data.email
		}));
	} catch (err) {
		console.log(err);
		throw err;
	} finally {
		auth.update((state) => ({
			...state,
			isLoading: false
		}));
	}
}

export async function verifyEmail({ email, code }: { email: string; code: string }) {
	auth.update((state) => ({ ...state, isLoading: true }));

	try {
		const { data } = await api.post('/auth/verify-email', { email, code });
		auth.update((state) => ({
			...state,
			email: data.data.email,
			accessToken: data.data.token,
			firstName: data.data.firstName,
			refreshToken: data.data.refreshToken || null
		}));
		if (browser) {
			localStorage.setItem('accessToken', data.data.token);
			if (data.data.refreshToken) {
				localStorage.setItem('refreshToken', data.data.refreshToken);
			}
		}
	} catch (error) {
		console.log(error);
		throw error;
	} finally {
		auth.update((state) => ({
			...state,
			isLoading: false
		}));
	}
}

export async function resendCode(email: string) {
	const { data } = await api.post('/auth/resend-verification', { email });
	if (data.success) {
		toast.success('Verification code resent successfully');
	}
}

export async function getCountries() {
	// check if there are countries in the store
	const current = get(auth);
	if (current.countries) return;

	auth.update((state) => ({ ...state, isLoading: true }));

	try {
		const { data } = await api.get('/countries');
		auth.update((state) => ({
			...state,
			countries: data.data
		}));
	} finally {
		auth.update((state) => ({
			...state,
			isLoading: false
		}));
	}
}

export async function forgetPassword(email: string) {
	auth.update((state) => ({ ...state, isLoading: true }));
	try {
		const { data } = await api.post('/auth/forgot-password', { email });
		console.log(data);
	} catch (error) {
		console.log(error);
		throw error;
	} finally {
		auth.update((state) => ({
			...state,
			isLoading: false
		}));
	}
}

export async function resetPassword(token: string, newPassword: string) {
	auth.update((state) => ({ ...state, isLoading: true }));
	try {
		const { data } = await api.post('/auth/reset-password', { token, newPassword });
		console.log(data);

		if (data.success) {
			toast.success('Password reset successfully');
		}
	} catch (error) {
		console.log(error);
		throw error;
	} finally {
		auth.update((state) => ({
			...state,
			isLoading: false
		}));
	}
}

export function logout() {
	// Clear both auth state and tokens from localStorage
	if (browser) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		// The auth store will sync automatically via createPersisted, but we ensure it's cleared
		auth.set({
			...initial,
			isInitialAuthCheckComplete: true
		});
	} else {
		// Server-side: just clear the store
		auth.set({
			...initial,
			isInitialAuthCheckComplete: true
		});
	}
}

export async function logOut() {
	auth.set({
		...initial,
		isInitialAuthCheckComplete: true
	});
	if (browser) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	}
}

// Refresh access token using refresh token
export async function refreshAccessToken(): Promise<boolean> {
	const currentAuth = get(auth);
	const refreshToken = currentAuth.refreshToken;

	if (!refreshToken) {
		return false;
	}

	try {
		const { data } = await api.post('/auth/refresh', { refreshToken });

		if (data.success && data.data) {
			auth.update((state) => ({
				...state,
				accessToken: data.data.token,
				refreshToken: data.data.refreshToken || state.refreshToken,
				email: data.data.email || state.email,
				firstName: data.data.firstName || state.firstName
			}));

			if (browser) {
				localStorage.setItem('accessToken', data.data.token);
				if (data.data.refreshToken) {
					localStorage.setItem('refreshToken', data.data.refreshToken);
				}
			}

			return true;
		}

		return false;
	} catch (error) {
		console.error('Error refreshing token:', error);
		return false;
	}
}

export function runInitialAuthCheck() {
	auth.update((state) => ({
		...state,
		isInitialAuthCheckComplete: true
	}));
}

if (browser) {
	runInitialAuthCheck();
}
