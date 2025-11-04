import axios from 'axios';
import { get } from 'svelte/store';
import { auth } from './stores/authStore';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL
});

// Request Interceptor - Inject Bearer Token
// api.interceptors.request.use((config) => {
// 	const token = get(auth.accessToken);

// 	if (token) {
// 		config.headers.Authorization = `Bearer ${token}`;
// 	}

// 	return config;
// });

// Respose Interceptor - Auto refresh on 401
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		if (err.response.status === 401) {
			// Logout here
			return Promise.reject(err);
		}
		return Promise.reject(err);
	}
);
