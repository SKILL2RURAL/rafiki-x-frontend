import axios from 'axios';
import { get } from 'svelte/store';
import { auth, logout } from './stores/authStore';
import { toast } from 'svelte-sonner';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { browser } from '$app/environment';

export const api = axios.create({
	baseURL: '/api'
});

// Public endpoints that MUST NOT receive Authorization headers
const publicEndpoints = [
	'/auth/register',
	'/auth/login',
	'/auth/forgot-password',
	'/auth/reset-password',
	'/auth/verify-email',
	'/chat/guest/message'
];

/**
 * Decode JWT token and check if it's expired
 * Returns null if token is not a valid JWT or if it can't be decoded
 * Returns true if token is expired, false if still valid
 */
function isTokenExpired(token: string): boolean | null {
	try {
		// JWT tokens have 3 parts separated by dots: header.payload.signature
		const parts = token.split('.');
		if (parts.length !== 3) {
			// Not a JWT token, can't check expiration
			return null;
		}

		// Decode the payload (second part)
		const payload = parts[1];
		// Add padding if needed for base64 decoding
		const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
		const decodedPayload = JSON.parse(atob(paddedPayload));

		// Check if token has expiration claim (exp)
		if (!decodedPayload.exp) {
			// Token doesn't have expiration claim
			return null;
		}

		// exp is in seconds, convert to milliseconds
		const expirationTime = decodedPayload.exp * 1000;
		const currentTime = Date.now();

		// Check if token is expired (with 5 second buffer to account for clock skew)
		return currentTime >= expirationTime - 5000;
	} catch (error) {
		// Failed to decode token, assume it's not a JWT or invalid
		console.warn('Failed to decode token:', error);
		return null;
	}
}

/**
 * Handle token expiration gracefully
 * Clears auth store and redirects to login if not already on a public route
 */
function handleTokenExpiration(isPublic: boolean) {
	// Clear auth store properly
	logout();

	// Only show toast and redirect if not on a public route
	if (!isPublic && browser) {
		// Check current path to avoid redirect loops
		const currentPath = window.location.pathname;
		const isOnPublicRoute = publicEndpoints.some((endpoint) =>
			currentPath.includes(endpoint.replace('/api', ''))
		);

		if (!isOnPublicRoute) {
			toast.error('Your session has expired. Please login again.');
			goto(resolve('/login'));
		}
	}
}

// Flag to prevent multiple simultaneous logout attempts
let isLoggingOut = false;

// REQUEST INTERCEPTOR
api.interceptors.request.use(
	(config) => {
		const token = get(auth).accessToken;

		// Add Authorization ONLY for private routes
		const isPublic = publicEndpoints.some((path) => config.url?.includes(path));

		if (!isPublic && token) {
			// Check if token is expired before making the request
			const expired = isTokenExpired(token);

			if (expired === true) {
				// Token is expired, handle gracefully
				if (!isLoggingOut) {
					isLoggingOut = true;
					handleTokenExpiration(isPublic);
					// Reset flag after a short delay
					setTimeout(() => {
						isLoggingOut = false;
					}, 1000);
				}
				// Reject the request to prevent it from going through with expired token
				return Promise.reject(new Error('Token expired'));
			}

			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const isPublic = publicEndpoints.some((path) => err.config?.url?.includes(path));

		if (err.code === 'ERR_NETWORK') {
			toast.error('Network Error. Please check your internet connection.');
			return Promise.reject(err);
		}

		// 401 - Unauthorized (Token expired or invalid)
		if (err.response?.status === 401 && !isPublic) {
			if (!isLoggingOut) {
				isLoggingOut = true;

				// Clear auth store properly
				logout();

				// Only show toast and redirect if not on a public route
				if (browser) {
					const currentPath = window.location.pathname;
					const isOnPublicRoute = publicEndpoints.some((endpoint) =>
						currentPath.includes(endpoint.replace('/api', ''))
					);

					if (!isOnPublicRoute) {
						toast.error('Your session has expired. Please login again.');
						goto(resolve('/login'));
					}
				}

				// Reset flag after a short delay
				setTimeout(() => {
					isLoggingOut = false;
				}, 1000);
			}
			return Promise.reject(err);
		}

		// 403 - Forbidden (Token doesn't have required permissions)
		if (err.response?.status === 403 && !isPublic) {
			if (!isLoggingOut) {
				isLoggingOut = true;

				// Clear auth store properly
				logout();

				if (browser) {
					const currentPath = window.location.pathname;
					const isOnPublicRoute = publicEndpoints.some((endpoint) =>
						currentPath.includes(endpoint.replace('/api', ''))
					);

					if (!isOnPublicRoute) {
						toast.error('Access denied. Please login again.');
						goto(resolve('/login'));
					}
				}

				setTimeout(() => {
					isLoggingOut = false;
				}, 1000);
			}
			return Promise.reject(err);
		}

		// 500 - Internal Server Error
		if (err.response?.status === 500) {
			// Don't redirect on 500 errors, let the component handle it
			return Promise.reject(err);
		}

		return Promise.reject(err);
	}
);
