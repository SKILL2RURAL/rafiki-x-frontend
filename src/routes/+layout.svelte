<script lang="ts">
	import favicon from '$lib/assets/logo.svg';
	import '../global.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Rafiki X</title>
	<meta name="description" content="Rafiki X - AI powered chatbot" />
</svelte:head>

<Toaster position="top-right" richColors />

{@render children?.()}
