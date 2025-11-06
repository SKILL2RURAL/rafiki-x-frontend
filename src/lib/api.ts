import axios from 'axios';
import { get } from 'svelte/store';
import { auth } from './stores/authStore';
import { toast } from 'svelte-sonner';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL
});

// Request Interceptor - Inject Bearer Token
api.interceptors.request.use((config) => {
	const token = get(auth).accessToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// Respose Interceptor - Auto refresh on 401
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		console.log(err);
		if (err.code === 'ERR_NETWORK') {
			toast.error('Network Error. Please check your internet connection.');
			return Promise.reject(err);
		}

		if (err.response.status === 401) {
			// Logout here
			toast.error('Unauthorized. Please login again.');
			return Promise.reject(err);
		}
		return Promise.reject(err);
	}
);
