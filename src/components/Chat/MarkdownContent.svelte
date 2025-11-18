<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	/** Props */
	export let raw: string = '';

	/** Sanitized HTML */
	let html = '';
	let container: HTMLElement;

	$: {
		// Re‑render when `raw` changes
		html = marked.parse(raw) as string;
	}

	onMount(() => {
		if (container) {
			const tables = container.querySelectorAll('table');
			tables.forEach((table) => {
				const wrapper = document.createElement('div');
				wrapper.className = 'overflow-x-auto';
				table.parentNode?.insertBefore(wrapper, table);
				wrapper.appendChild(table);
			});
		}
		// Add smooth scrolling for anchor links
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', (e) => {
				e.preventDefault();
				const target = document.querySelector(anchor.getAttribute('href')!);
				target?.scrollIntoView({ behavior: 'smooth' });
			});
		});
	});
</script>

<article
	bind:this={container}
	class="prose prose-lg max-w-none prose-headings:scroll-mt-24 markdown-content"
>
	{@html html}
</article>

<style>
	:global(.markdown-content p),
	:global(.markdown-content li),
	:global(.markdown-content th),
	:global(.markdown-content td) {
		overflow-wrap: break-word;
		word-wrap: break-word;
		word-break: break-word;
	}

	:global(.markdown-content pre) {
		white-space: pre-wrap;
	}

	:global(.markdown-content code) {
		white-space: pre-wrap;
		width: 100%;
	}
	:global(.markdown-content hr) {
		margin: 1rem 0;
	}
	:global(.markdown-content pre) {
		margin: 1rem 0;
	}

	:global(.markdown-content p) {
		margin-bottom: 1rem;
	}

	:global(.markdown-content code) {
		width: 100%;
	}

	:global(.markdown-content h2) {
		margin-bottom: 1rem;
		font-weight: 700;
		font-size: 1rem;
	}

	:global(.markdown-content h3) {
		margin-bottom: 0.5rem;
		font-weight: 500;
		font-size: 1rem;
	}
	:global(.markdown-content ol),
	:global(.markdown-content ul) {
		margin-left: 1.5rem;
	}

	:global(.markdown-content li) {
		list-style-type: disc;
		margin-bottom: 0.5rem;
	}

	:global(.markdown-content table) {
		border-collapse: collapse;
		margin: 1rem 0;
		font-size: 0.875rem;
		min-width: max-content; /* Ensure table doesn't shrink */
	}

	:global(.markdown-content th),
	:global(.markdown-content td) {
		padding: 0.75rem 1rem;
		border: 1px solid #e5e7eb;
		text-align: left;
	}

	:global(.markdown-content td) {
		/* background-color: red; */
		max-width: 600px;
	}

	:global(.markdown-content th) {
		background-color: #f9fafb;
		font-weight: 600;
		color: #374151;
	}

	:global(.markdown-content tr:nth-child(even)) {
		background-color: #f9fafb;
	}

	:global(.markdown-content tr:hover) {
		background-color: #f3f4f6;
	}

	:global(.markdown-content .overflow-x-auto) {
		overflow-x: auto;
		margin: 1rem 0;
	}

	/* Dark mode styles */
	:global(.dark .markdown-content th) {
		background-color: #374151;
		color: #f9fafb;
		border-color: #4b5563;
	}

	:global(.dark .markdown-content td) {
		border-color: #4b5563;
		color: #e5e7eb;
	}

	:global(.dark .markdown-content tr:nth-child(even)) {
		background-color: #374151;
	}

	:global(.dark .markdown-content tr:hover) {
		background-color: #4b5563;
	}
</style>
