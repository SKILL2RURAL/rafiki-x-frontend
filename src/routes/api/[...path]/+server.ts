import { API_BASE_URL } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE_URL}/${path}`;

	const response = await fetch(targetUrl, {
		method: 'GET',
		headers: {
			Authorization: request.headers.get('authorization') || ''
		}
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

export const DELETE: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE_URL}/${path}`;

	const response = await fetch(targetUrl, {
		method: 'DELETE',
		headers: {
			Authorization: request.headers.get('authorization') || ''
		}
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: response.status });
};
