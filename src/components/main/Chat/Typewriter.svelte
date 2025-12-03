<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import MarkdownContent from './MarkdownContent.svelte';

	export let text = '';
	export let speed = 10;

	let displayedText = '';
	const dispatch = createEventDispatcher();

	onMount(() => {
		let currentIndex = 0;
		const interval = setInterval(() => {
			if (currentIndex < text.length) {
				displayedText = text.substring(0, currentIndex + 1);
				currentIndex++;
				dispatch('tick');
			} else {
				clearInterval(interval);
				dispatch('typingComplete');
			}
		}, speed);

		return () => clearInterval(interval);
	});
</script>

<MarkdownContent raw={displayedText} />
