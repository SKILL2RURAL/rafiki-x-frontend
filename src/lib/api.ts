import axios from 'axios';
import { get } from 'svelte/store';
import { auth } from './stores/authStore';
import { toast } from 'svelte-sonner';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL
});

// Public endpoints that MUST NOT receive Authorization headers
const publicEndpoints = [
	'/auth/register',
	'/auth/login',
	'/auth/forgot-password',
	'/auth/reset-password',
	'/auth/verify-email'
];

api.interceptors.request.use((config) => {
	const token = get(auth).accessToken;

	// Remove Authorization header for public routes
	if (!publicEndpoints.some((path) => config.url?.includes(path))) {
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}

	return config;
});
