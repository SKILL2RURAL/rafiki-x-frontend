<script lang="ts">
	import favicon from '$lib/assets/logo.svg';
	import '../global.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Rafiki X</title>
	<meta name="description" content="Rafiki X - AI powered chatbot" />
</svelte:head>

{@render children?.()}
