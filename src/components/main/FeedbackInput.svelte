<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	let { closeFeedback }: { closeFeedback: () => void } = $props();

	let text = $state('');
</script>

<div class="bg-white px-5 h-[320px] w-[800px] flex flex-col justify-center">
	<p class="font-semibold my-3">Add Feedback<span class="font-normal">(optional)</span></p>
	<textarea
		placeholder="Enter text here..."
		bind:value={text}
		class="rounded-[10px] border border-[#C4C4C4] h-[210px] w-full p-3"
	>
	</textarea>

	<div class="grid grid-cols-2 gap-5 mt-5">
		<Button
			onclick={closeFeedback}
			class="w-full h-[60px] border border-[#808990] bg-white text-[#808990] rounded-[10px] hover:bg-[#808990]/5 hover:text-[#808990]"
			>No, Thanks</Button
		>
		<Button
			onclick={closeFeedback}
			class="w-full h-[60px] text-white rounded-[10px] bg-linear-to-r from-[#51A3DA] to-[#60269E]"
			>Send</Button
		>
	</div>
</div>
