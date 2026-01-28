<script>
	let text = $state('');
</script>

<div class="p-5 h-full">
	<textarea
		bind:value={text}
		class="h-full w-full py-2.5 px-4 border border-[#C4C4C4] rounded-[10px] font-mulish text-[18px] leading-6 font-normal"
		placeholder="Enter text here..."
	></textarea>
</div>
