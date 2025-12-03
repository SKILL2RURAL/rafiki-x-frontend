<script lang="ts">
	import { goto } from '$app/navigation';
	import book from '$lib/assets/icons/book.png';
	import mic from '$lib/assets/icons/mic.svg';
	import pen from '$lib/assets/icons/pen.png';
	import searchIcon from '$lib/assets/icons/search-normal.svg';
	import send from '$lib/assets/icons/send.svg';
	import { Input } from '$lib/components/ui/input';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { chatStore, sendingMessage } from '$lib/stores/chatStore';

	const { sendMessage } = chatStore;

	function handleFocus() {
		setTimeout(() => {
			window.scroll({
				top: window.scrollY + 100,
				behavior: 'smooth'
			});
		}, 300);
	}

	let text = '';

	// FUNCTION TO START A NEW CONVERSATION
	async function handleSend(value?: string) {
		await sendMessage({
			message: value ? value : text.trim(),
			createNewConversation: true
		}).then((res) => {
			goto(`/${res.conversationId}`);
		});
	}
</script>

<div
	class="bg-gradient-background px-3 py-10 lg:p-10 rounded-[20px] text-center font-mulish text-white relative flex flex-col"
>
	<h1 class="font-bold text-[24px] text-white mt-5 lg:mt-0">
		Welcome to <span class="bg-white p-2 px-3 rounded-[100px] font-bold text-[20px]">
			<span class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
				>RafikiX</span
			>
		</span>
		, your personal AI Career Assistant
	</h1>
	<p class="text-[14px] font-normal mt-3 lg:w-[80%] mx-auto">
		RafikiX helps you explore opportunities, gain clarity, and build confidence at every stage of
		your career. <a href="/learn-more" class="underline">Learn more about RafikiX policy here.</a>
	</p>

	<div
		class="bg-white px-5 lg:p-10 py-10 lg:py-15 shadow-md rounded-[20px] my-5 lg:my-10 sm:max-w-full lg:max-w-full mx-0 lg:mx-15"
	>
		<div class="flex items-center gap-3">
			<div class="border border-[#E8E8E8] rounded-[100px] flex px-4 py-2 w-full">
				<img src={searchIcon} alt="Search Icon" width="20" height="20" />
				<Input
					type="text"
					placeholder="Ask a question to explore career options"
					class="w-full border-none outline-none focus-visible:ring-transparent placeholder:text-[14px] lg:placeholder:font-light placeholder:text-[#80899A] text-black shadow-none"
					onfocus={handleFocus}
					bind:value={text}
				/>
			</div>
			<div>
				{#if text.length > 0}
					<button
						class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100 flex items-center justify-center"
						disabled={$sendingMessage}
						onclick={() => handleSend()}
					>
						{#if $sendingMessage}
							<Spinner color="black" size="md" />
						{:else}
							<img src={send} class="mx-auto" width="20" height="20" alt="send icon" />
						{/if}
					</button>
				{/if}
			</div>
		</div>

		<div
			class="items-center justify-center mt-3 lg:mt-5 flex gap-5 w-full max-w-[300px] lg:max-w-full mx-auto overflow-x-auto no-scrollbar pb-1"
		>
			<button
				class="shadow-md rounded-[100px] flex items-center justify-center gap-2 px-6 lg:px-4 py-3 w-fit whitespace-nowrap"
				onclick={() =>
					handleSend(
						"I want to write a story, but I'm not sure where to start. Can you ask me some questions to help me get started and then help me write it?"
					)}
				disabled={$sendingMessage}
			>
				<img src={book} alt="" width="18" height="18" />
				<p class="text-[14px] lg:font-normal text-[#1E1E1E]">Write a Story</p>
			</button>
			<button
				class="shadow-md rounded-[100px] flex items-center justify-center gap-2 px-6 lg:px-4 py-3 w-fit whitespace-nowrap"
				onclick={() =>
					handleSend(
						"I'd like to have a chat about my career. I'm at a crossroads and could use some help exploring my options. Can you ask me some questions to understand my situation better?"
					)}
				disabled={$sendingMessage}
			>
				<img src={pen} alt="pen" width="15" height="15" />
				<p class="text-[14px] lg:font-normal text-[#1E1E1E]">Career Chat</p>
			</button>
			<button
				class="shadow-md rounded-[100px] flex items-center justify-center gap-2 px-6 lg:px-4 py-3 w-fit whitespace-nowrap"
				onclick={() =>
					handleSend(
						"I have an interview coming up and I'm feeling nervous. Can you help me prepare by running through some common interview questions and giving me feedback?"
					)}
				disabled={$sendingMessage}
			>
				<img src={mic} alt="mic" width="20" height="20" />
				<p class="text-[14px] lg:font-normal text-[#1E1E1E]">Interview Prep</p>
			</button>
		</div>
	</div>

	<p class="text-[14px] font-normal text-[#686868]">
		By messaging RafikiX, you agree to our
		<span class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
			>Terms and Conditions</span
		>
	</p>
</div>
