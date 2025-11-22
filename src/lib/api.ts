import axios from 'axios';
import { get } from 'svelte/store';
import { auth } from './stores/authStore';
import { toast } from 'svelte-sonner';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export const api = axios.create({
	baseURL: '/api'
});

// Public endpoints that MUST NOT receive Authorization headers
const publicEndpoints = [
	'/auth/register',
	'/auth/login',
	'/auth/forgot-password',
	'/auth/reset-password',
	'/auth/verify-email'
];

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
	const token = get(auth).accessToken;

	// Add Authorization ONLY for private routes
	const isPublic = publicEndpoints.some((path) => config.url?.includes(path));

	if (!isPublic && token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const isPublic = publicEndpoints.some((path) => err.config?.url?.includes(path));

		if (err.code === 'ERR_NETWORK') {
			toast.error('Network Error. Please check your internet connection.');
			return Promise.reject(err);
		}

		// 401 - Unauthorized
		if (err.response?.status === 401 && !isPublic) {
			toast.error('Unauthorized. Please login again.');
			localStorage.removeItem('accessToken');
			goto(resolve('/login'));
			return Promise.reject(err);
		}

		// 403 - Forbidden
		if (err.response?.status === 403 && !isPublic) {
			localStorage.removeItem('accessToken');
			goto(resolve('/login'));
			return Promise.reject(err);
		}

		if (err.response?.status === 500) {
			toast.error('Internal Server Error. Please try again later.');
			return Promise.reject(err);
		}

		return Promise.reject(err);
	}
);
