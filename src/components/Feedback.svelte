<script lang="ts">
	let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	let { showFeedbackInput }: { showFeedbackInput: () => boolean } = $props();
</script>

<div class="bg-white px-5 h-[320px] w-[800px] flex flex-col justify-center">
	<h4 class="font-bold text-[24px] text-center">Enjoying Rafiki</h4>
	<p class="text-[24px] text-[#808990] font-satoshi-regular text-center">
		How likely are you to recommend Rafiki to a friend?
	</p>

	<div class="flex flex-row gap-5 justify-between my-5">
		{#each numbers as number}
			<button
				class="text-[24px] font-bold text-[#253B4B] bg-[#FCFCFD] p-5 py-2 rounded-[2px]"
				onclick={showFeedbackInput}
			>
				{number}
			</button>
		{/each}
	</div>

	<div
		class="text-[24px] font-satoshi-regular text-[#808990] flex items-center justify-between mb-5"
	>
		<p>Not Likely</p>
		<p>Very Likely</p>
	</div>
</div>
