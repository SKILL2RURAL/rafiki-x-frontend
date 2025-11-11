<script lang="ts">
	import { onMount } from 'svelte';
	import MarkdownContent from './MarkdownContent.svelte';

	export let text = '';
	export let speed = 10;

	let displayedText = '';

	onMount(() => {
		let currentIndex = 0;
		const interval = setInterval(() => {
			if (currentIndex < text.length) {
				displayedText = text.substring(0, currentIndex + 1);
				currentIndex++;
			} else {
				clearInterval(interval);
			}
		}, speed);

		return () => clearInterval(interval);
	});
</script>

<MarkdownContent raw={displayedText} />
