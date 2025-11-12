import { browser } from '$app/environment';
import { api } from '$lib/api';
import { setCookie } from '$lib/utils/cookies';
import { derived, get, writable, type Writable } from 'svelte/store';
import type { LoginPayload, RegisterPayload } from '../types/auth';
import { toast } from 'svelte-sonner';

// Persistent Stores
function createPersisted<T>(key: string, start: T): Writable<T> {
	const initial =
		browser && localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : start;

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
	isLoading: boolean;
	countries: { code: string; name: string }[] | null;
}

// Core Store
const initial: AuthState = {
	email: null,
	firstName: null,
	isLoading: false,
	accessToken: null,
	countries: null
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

	try {
		const { data } = await api.post('/auth/login', payload);
		auth.update((state) => ({
			...state,
			email: data.data.email,
			firstName: data.data.firstName,
			accessToken: data.data.token
		}));
		if (browser) {
			setCookie('accessToken', data.data.token);
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
			// accessToken: data.data.token
		}));
		// if (browser) {
		// 	setCookie('accessToken', data.data.token);
		// }
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
		auth.update((state) => ({ ...state, email: data.data.email, accessToken: data.data.token }));
		if (browser) {
			setCookie('accessToken', data.data.token);
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

export async function logOut() {
	auth.update(() => ({
		email: null,
		firstName: null,
		accessToken: null,
		isLoading: false,
		countries: null
	}));
	if (browser) {
		localStorage.removeItem('accessToken');
	}
}
