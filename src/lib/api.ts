import axios, { type InternalAxiosRequestConfig } from 'axios';
import { get } from 'svelte/store';
import { auth, logout, refreshAccessToken } from './stores/authStore';
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
	'/auth/refresh',
	'/chat/guest/message',
	'/career-guide',
	'/my-resume',
	'/terms-and-conditions'
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
// Flag to prevent multiple simultaneous token refresh attempts
let isRefreshing = false;
// Queue to store failed requests while token is being refreshed
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (error?: unknown) => void;
	config: InternalAxiosRequestConfig;
}> = [];

// REQUEST INTERCEPTOR
api.interceptors.request.use(
	(config) => {
		const token = get(auth).accessToken;

		// Add Authorization ONLY for private routes
		const isPublic = publicEndpoints.some((path) => config.url?.includes(path));

		if (!isPublic && token) {
			// Check if token is expired before making the request
			const expired = isTokenExpired(token);
			const currentAuth = get(auth);
			const hasRefreshToken = !!currentAuth.refreshToken;

			if (expired === true) {
				// Token is expired
				// If we have a refresh token, allow the request to proceed
				// The 401 response interceptor will handle refreshing and retrying
				if (!hasRefreshToken) {
					// No refresh token available, handle gracefully
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
				// If we have a refresh token, let the request proceed
				// The 401 handler will catch it and refresh the token
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
		// const isPublic = publicEndpoints.some((path) => err.config?.url?.includes(path));

		if (err.code === 'ERR_NETWORK') {
			toast.error('Network Error. Please check your internet connection.');
			return Promise.reject(err);
		}

		// 401 - Unauthorized (Token expired or invalid)
		if (err.response?.status === 401) {
			const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };
			const currentAuth = get(auth);
			const hasRefreshToken = !!currentAuth.refreshToken;

			// If this is already a retry after refresh, or refresh endpoint, don't try again
			if (originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
				// Refresh failed, logout user
				if (!isLoggingOut) {
					isLoggingOut = true;
					logout();

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

					setTimeout(() => {
						isLoggingOut = false;
					}, 1000);
				}
				return Promise.reject(err);
			}

			// Only try to refresh token if we have a refresh token available
			if (hasRefreshToken && !isRefreshing) {
				isRefreshing = true;
				originalRequest._retry = true;

				try {
					const refreshed = await refreshAccessToken();

					if (refreshed) {
						// Update the authorization header with new token
						const newToken = get(auth).accessToken;
						if (newToken && originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${newToken}`;
						}

						// Retry the original request
						isRefreshing = false;
						// Process any queued requests
						failedQueue.forEach((promise) => {
							const token = get(auth).accessToken;
							if (token && promise.config.headers) {
								promise.config.headers.Authorization = `Bearer ${token}`;
							}
							api.request(promise.config).then(promise.resolve).catch(promise.reject);
						});
						failedQueue = [];

						return api(originalRequest);
					} else {
						// Refresh failed, logout user
						isRefreshing = false;
						if (!isLoggingOut) {
							isLoggingOut = true;
							logout();

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

							setTimeout(() => {
								isLoggingOut = false;
							}, 1000);
						}
						return Promise.reject(err);
					}
				} catch (refreshError) {
					// Refresh failed, logout user
					isRefreshing = false;
					failedQueue = [];

					if (!isLoggingOut) {
						isLoggingOut = true;
						logout();

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

						setTimeout(() => {
							isLoggingOut = false;
						}, 1000);
					}
					return Promise.reject(refreshError);
				}
			} else if (hasRefreshToken && isRefreshing) {
				// Token refresh is already in progress, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({
						resolve,
						reject,
						config: originalRequest
					});
				});
			} else {
				// No refresh token available, logout user
				if (!isLoggingOut) {
					isLoggingOut = true;
					logout();

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

					setTimeout(() => {
						isLoggingOut = false;
					}, 1000);
				}
				return Promise.reject(err);
			}
		}

		// 403 - Forbidden (Token doesn't have required permissions)
		if (err.response?.status === 403) {
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
			return Promise.reject(err);
		}

		return Promise.reject(err);
	}
);
