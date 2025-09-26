<script>
	import { Input } from '$lib/components/ui/input';
	import searchIcon from '$lib/assets/icons/search-normal.svg';
	import mic from '$lib/assets/icons/mic.svg';
	import pdf from '$lib/assets/icons/file-pdf.svg';
	import send from '$lib/assets/icons/send.svg';
	import { goto } from '$app/navigation';

	function handleFocus() {
		setTimeout(() => {
			window.scroll({
				top: window.scrollY + 100,
				behavior: 'smooth'
			});
		}, 300);
	}

	let text = '';

	function handleSend() {
		goto(`/2`);
	}
</script>

<div
	class="bg-gradient-to-b px-3 py-10 lg:p-10 rounded-[20px] from-[#928bb8] via-[#ebdef8] to-[#FFFFFF] text-center font-mulish text-white relative flex flex-col items-center"
>
	<h1 class="font-bold text-[24px] text-white mt-5 lg:mt-0">
		Welcome to <span class="bg-white p-2 px-3 rounded-[100px] font-bold text-[20px]">
			<span class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
				>RafikiX</span
			>
		</span>
		, your personal AI Career Assistant
	</h1>
	<p class="text-[12px] font-bold mt-3 lg:w-[80%] mx-auto">
		RafikiX helps you explore opportunities, gain clarity, and build confidence at every stage of
		your career. <a href="/career-guide" class="underline">Learn more about RafikiX policy here.</a>
	</p>

	<div
		class="bg-white px-5 lg:p-10 py-10 lg:py-15 shadow-md rounded-[20px] my-5 lg:my-10 max-w-[90vw] sm:max-w-full lg:max-w-full"
	>
		<div class="flex items-center gap-3">
			<div class="border border-[#E8E8E8] rounded-[100px] flex px-4 py-2 w-full">
				<img src={searchIcon} alt="Search Icon" width="20" height="20" />
				<Input
					type="text"
					placeholder="Ask a question to explore career options"
					class="w-full border-none outline-none focus-visible:ring-transparent placeholder:text-[14px] lg:placeholder:font-bold placeholder:text-[#80899A] text-black shadow-none"
					onfocus={handleFocus}
					bind:value={text}
				/>
			</div>
			<div>
				{#if text.length === 0}
					<!-- Mic Button -->
					<button
						class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100"
						onclick={handleSend}
					>
						<img src={mic} class="mx-auto" width="20" height="20" alt="mic icon" />
					</button>
				{:else}
					<!-- Send Button -->
					<button
						class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100"
						onclick={handleSend}
					>
						<img src={send} class="mx-auto" width="20" height="20" alt="send icon" />
					</button>
				{/if}
			</div>
		</div>

		<div class="mt-3 lg:mt-5 flex gap-5 w-full overflow-x-auto no-scrollbar pb-1">
			<button
				class="shadow-md rounded-[100px] flex items-center justify-center gap-2 px-6 lg:px-4 py-3 w-full whitespace-nowrap"
				onclick={() => goto('/2')}
			>
				<img src={mic} alt="mic" width="20" height="20" />
				<p class="text-[14px] lg:font-bold text-[#1E1E1E]">Write a Story</p>
			</button>
			<button
				class="shadow-md rounded-[100px] flex items-center justify-center gap-2 px-6 lg:px-4 py-3 w-full whitespace-nowrap"
			>
				<img src={pdf} alt="mic" width="20" height="20" />
				<p class="text-[14px] lg:font-bold text-[#1E1E1E]">Career Chat</p>
			</button>
			<button
				class="shadow-md rounded-[100px] flex items-center justify-center gap-2 px-6 lg:px-4 py-3 w-full whitespace-nowrap"
			>
				<img src={mic} alt="mic" width="20" height="20" />
				<p class="text-[14px] lg:font-bold text-[#1E1E1E]">Interview Prep</p>
			</button>
		</div>
	</div>

	<p class="text-[14px] font-bold text-[#686868]">
		By messaging RafikiX, you agree to our
		<span class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
			>Terms and Conditions</span
		>
	</p>
</div>
