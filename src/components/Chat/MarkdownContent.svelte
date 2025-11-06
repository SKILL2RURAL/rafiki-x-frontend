<!-- src/lib/components/MarkdownContent.svelte -->
<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	/** Props */
	export let raw: string = '';

	/** Sanitized HTML */
	let html = '';

	/** Configure marked */
	const renderer = new marked.Renderer();

	//   // Optional: make tables responsive
	//   renderer.table = (header: string, body: string) =>
	//     `<div class="overflow-x-auto"><table class="table table-zebra w-full">${header}${body}</table></div>`;

	//   marked.setOptions({
	//     renderer,
	//     gfm: true,
	//     breaks: false,
	//     headerIds: true,
	//     mangle: false,
	//   });

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
