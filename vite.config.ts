import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson(), tailwindcss()],
	server: {
		allowedHosts: [
			'.ngrok-free.app' // your ngrok domain
		]
	}
});
