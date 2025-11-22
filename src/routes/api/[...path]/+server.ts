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

	const body = await request.text();

	const response = await fetch(targetUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: request.headers.get('authorization') || ''
		},
		body
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: response.status });
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
	const targetUrl = `${API_BASE_URL}/${path}`;

	const body = await request.text();

	const response = await fetch(targetUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: request.headers.get('authorization') || ''
		},
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
