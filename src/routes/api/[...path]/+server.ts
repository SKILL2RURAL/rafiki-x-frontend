import { API_BASE_URL } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, request, url }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	// Forward query parameters from the original request
	const queryString = url.searchParams.toString();
	const targetUrl = queryString
		? `${API_BASE_URL}/${path}?${queryString}`
		: `${API_BASE_URL}/${path}`;

	const headers: HeadersInit = {
		Authorization: request.headers.get('authorization') || ''
	};

	// Forward X-Guest-Session-Id header if present
	const guestSessionId = request.headers.get('x-guest-session-id');
	if (guestSessionId) {
		headers['X-Guest-Session-Id'] = guestSessionId;
	}

	const response = await fetch(targetUrl, {
		method: 'GET',
		headers
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: response.status });
};

export const POST: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE_URL}/${path}`;

	const contentType = request.headers.get('content-type') || '';
	const isFormData = contentType.includes('multipart/form-data');

	let body: BodyInit;
	const headers: HeadersInit = {
		Authorization: request.headers.get('authorization') || ''
	};

	// Forward X-Guest-Session-Id header if present
	const guestSessionId = request.headers.get('x-guest-session-id');
	if (guestSessionId) {
		headers['X-Guest-Session-Id'] = guestSessionId;
	}

	if (isFormData) {
		// For FormData, preserve it and let fetch set the Content-Type with boundary
		body = await request.formData();
		// Don't set Content-Type - fetch will set it automatically with boundary
	} else {
		// For JSON and other content types
		body = await request.text();
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(targetUrl, {
		method: 'POST',
		headers,
		body
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: response.status });
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE_URL}/${path}`;

	const contentType = request.headers.get('content-type') || '';
	const isFormData = contentType.includes('multipart/form-data');

	let body: BodyInit;
	const headers: HeadersInit = {
		Authorization: request.headers.get('authorization') || ''
	};

	// Forward X-Guest-Session-Id header if present
	const guestSessionId = request.headers.get('x-guest-session-id');
	if (guestSessionId) {
		headers['X-Guest-Session-Id'] = guestSessionId;
	}

	if (isFormData) {
		// For FormData, preserve it and let fetch set the Content-Type with boundary
		body = await request.formData();
		// Don't set Content-Type - fetch will set it automatically with boundary
	} else {
		// For JSON and other content types
		body = await request.text();
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(targetUrl, {
		method: 'PUT',
		headers,
		body
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: response.status });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE_URL}/${path}`;

	const contentType = request.headers.get('content-type') || '';
	const isFormData = contentType.includes('multipart/form-data');

	let body: BodyInit;
	const headers: HeadersInit = {
		Authorization: request.headers.get('authorization') || ''
	};

	// Forward X-Guest-Session-Id header if present
	const guestSessionId = request.headers.get('x-guest-session-id');
	if (guestSessionId) {
		headers['X-Guest-Session-Id'] = guestSessionId;
	}

	if (isFormData) {
		// For FormData, preserve it and let fetch set the Content-Type with boundary
		body = await request.formData();
		// Don't set Content-Type - fetch will set it automatically with boundary
	} else {
		// For JSON and other content types
		body = await request.text();
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(targetUrl, {
		method: 'PATCH',
		headers,
		body
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: response.status });
};

export const DELETE: RequestHandler = async ({ params, request, url }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	// Forward query parameters from the original request
	const queryString = url.searchParams.toString();
	const targetUrl = queryString
		? `${API_BASE_URL}/${path}?${queryString}`
		: `${API_BASE_URL}/${path}`;

	const headers: HeadersInit = {
		Authorization: request.headers.get('authorization') || ''
	};

	// Forward X-Guest-Session-Id header if present
	const guestSessionId = request.headers.get('x-guest-session-id');
	if (guestSessionId) {
		headers['X-Guest-Session-Id'] = guestSessionId;
	}

	const response = await fetch(targetUrl, {
		method: 'DELETE',
		headers
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: response.status });
};
