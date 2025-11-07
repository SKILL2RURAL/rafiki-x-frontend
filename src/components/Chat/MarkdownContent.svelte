<!-- src/lib/components/MarkdownContent.svelte -->
<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	/** Props */
	export let raw: string = '';

	/** Sanitized HTML */
	let html = '';

	$: {
		// Re‑render when `raw` changes
		html = marked.parse(raw) as string;
	}

	onMount(() => {
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

<article class="prose prose-lg max-w-none prose-headings:scroll-mt-24">
	{@html html}
</article>

<style>
	:global(hr) {
		margin: 1rem 0;
	}

	:global(h2) {
		margin-bottom: 1rem;
		font-weight: 700;
		font-size: 1rem;
	}
	:global(ol, ul) {
		margin-left: 1.5rem;
	}
	:global(li) {
		list-style-type: disc;
		margin-bottom: 0.5rem;
	}

	:global(article table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
		font-size: 0.875rem;
	}

	:global(article th),
	:global(article td) {
		padding: 0.75rem 1rem;
		border: 1px solid #e5e7eb;
		text-align: left;
	}

	:global(article th) {
		background-color: #f9fafb;
		font-weight: 600;
		color: #374151;
	}

	:global(article tr:nth-child(even)) {
		background-color: #f9fafb;
	}

	:global(article tr:hover) {
		background-color: #f3f4f6;
	}

	:global(article .overflow-x-auto) {
		overflow-x: auto;
		margin: 1rem 0;
	}

	/* Dark mode styles */
	:global(.dark article th) {
		background-color: #374151;
		color: #f9fafb;
		border-color: #4b5563;
	}

	:global(.dark article td) {
		border-color: #4b5563;
		color: #e5e7eb;
	}

	:global(.dark article tr:nth-child(even)) {
		background-color: #374151;
	}

	:global(.dark article tr:hover) {
		background-color: #4b5563;
	}
</style>
