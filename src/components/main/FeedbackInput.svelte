<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { submitReview, reviewStore } from '$lib/stores/reviews';

	let { closeFeedback, rating }: { closeFeedback: () => void; rating: number } = $props();

	let text = $state('');
	let isSubmitting = $derived($reviewStore.isSubmitting);

	async function handleSubmit() {
		if (isSubmitting) return;

		const review = await submitReview({
			rating,
			comment: text.trim() || ''
		});

		if (review) {
			closeFeedback();
		}
	}
</script>

<div class="bg-white px-5 h-80 w-[800px] flex flex-col justify-center">
	<p class="font-semibold my-3">Add Feedback<span class="font-normal">(optional)</span></p>
	<textarea
		placeholder="Enter text here..."
		bind:value={text}
		disabled={isSubmitting}
		class="rounded-[10px] border border-[#C4C4C4] h-[210px] w-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
	>
	</textarea>

	<div class="grid grid-cols-2 gap-5 my-5">
		<Button
			onclick={closeFeedback}
			disabled={isSubmitting}
			class="w-full h-[60px] border border-[#808990] bg-white text-[#808990] rounded-[10px] hover:bg-[#808990]/5 hover:text-[#808990] disabled:opacity-50 disabled:cursor-not-allowed"
			>Cancel</Button
		>
		<Button
			onclick={handleSubmit}
			disabled={isSubmitting}
			class="w-full h-[60px] text-white rounded-[10px] bg-linear-to-r from-[#51A3DA] to-[#60269E] disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isSubmitting ? 'Sending...' : 'Send'}
		</Button>
	</div>
</div>
