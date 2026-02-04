<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import book from '$lib/assets/icons/book.png';
	import album from '$lib/assets/icons/album.png';
	import chat from '$lib/assets/icons/chat.png';
	import searchIcon from '$lib/assets/icons/search-normal.svg';
	import send from '$lib/assets/icons/send.svg';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import WelcomeMicrophone from './main/Chat/WelcomeMicrophone.svelte';
	import { chatStore, sendingMessage, isRecording, isTranscribing } from '$lib/stores/chatStore';
	import { auth } from '$lib/stores/authStore';
	import type { ChatContext } from '$lib/types/chat';
	import { getDots } from './main/Chat/inputArea.utils';
	import { startDotCountAnimation } from './main/Chat/inputArea.actions';
	import { Mic } from 'lucide-svelte';

	const onOpenCreateAccount = getContext<(() => void) | undefined>('onOpenCreateAccount');

	let text = $state('');
	let dotCount = $state(0);
	let textareaRef: HTMLTextAreaElement | null = $state(null);

	function resizeTextarea(el: HTMLTextAreaElement | null) {
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
	}

	$effect(() => {
		text;
		resizeTextarea(textareaRef);
	});

	$effect(() => {
		if ($isRecording || $isTranscribing) {
			return startDotCountAnimation((n: number) => (dotCount = n));
		}
		dotCount = 0;
	});

	let placeholder = $state('Ask a question to explore career options');

	function updatePlaceholder() {
		placeholder =
			window.innerWidth < 640 ? 'Ask Rafiki' : 'Ask a question to explore career options';
	}

	onMount(() => {
		updatePlaceholder();
		window.addEventListener('resize', updatePlaceholder);
		return () => window.removeEventListener('resize', updatePlaceholder);
	});

	function handleFocus() {
		setTimeout(() => {
			window.scroll({
				top: window.scrollY + 100,
				behavior: 'smooth'
			});
		}, 300);
	}

	// FUNCTION TO START A NEW CONVERSATION
	async function handleSend(value?: string, chatContext?: ChatContext) {
		const content = value ? value : text.trim();

		// Send Message for Guest User if not authenticated
		if (!$auth.accessToken) {
			chatStore.setMessages([
				{
					id: new Date().getTime(),
					role: 'USER',
					content,
					chatContext: chatContext || null,
					createdAt: new Date().toISOString(),
					attachments: []
				}
			]);
			await chatStore.sendGuestMessage(content, chatContext || null);
			goto('/guest');
			return;
		}
		// For Authenticated Users
		await chatStore
			.sendMessage({
				message: content,
				createNewConversation: true,
				chatContext: chatContext || null
			})
			.then((res) => {
				goto(`/${res.conversationId}`);
			});
	}
</script>

<div
	class="bg-gradient-background px-3 py-10 lg:p-10 rounded-[20px] text-center font-mulish text-white relative flex flex-col"
>
	<h1
		class="text-[24px] text-white mt-5 lg:mt-0 tracking-wider"
		style="font-family: 'Impact', sans-serif;"
	>
		Welcome to <span class="bg-white p-2 px-3 rounded-[100px] font-bold text-[20px]">
			<span
				class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text font-mulish"
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
		<div class="flex items-center gap-2 sm:gap-3">
			<div
				class="border border-[#E8E8E8] rounded-[16px] sm:rounded-[20px] flex px-3 sm:px-4 h-10 min-h-10 sm:h-11 sm:min-h-11 lg:h-12 lg:min-h-12 w-full items-center"
			>
				{#if $isRecording}
					<p class="text-[#80899A] text-[13px] sm:text-[14px] font-medium animate-pulse">
						Listening{getDots(dotCount)}
					</p>
				{:else if $isTranscribing}
					<p class="text-[#80899A] text-[13px] sm:text-[14px] font-medium animate-pulse">
						Analyzing your input{getDots(dotCount)}
					</p>
				{:else}
					<img
						src={searchIcon}
						alt="Search Icon"
						width="20"
						height="20"
						class="shrink-0 size-4 sm:size-5 mr-2"
					/>
					<!-- <textarea
						bind:this={textareaRef}
						bind:value={text}
						{placeholder}
						rows={1}
						class="w-full min-h-6 max-h-[200px] resize-none border-none outline-none focus:outline-none focus-visible:ring-0 placeholder:text-[14px] lg:placeholder:font-light placeholder:text-[#80899A] text-black bg-transparent py-1 overflow-y-auto"
						onfocus={handleFocus}
						oninput={() => resizeTextarea(textareaRef)}
					></textarea> -->
					<input
						type="text"
						bind:value={text}
						{placeholder}
						class="w-full border-none outline-none focus:outline-none focus-visible:ring-0 placeholder:text-[13px] sm:placeholder:text-[14px] lg:placeholder:font-light placeholder:text-[#80899A] text-black bg-transparent py-1 text-[13px] sm:text-[14px]"
						onfocus={handleFocus}
					/>
				{/if}
			</div>

			<div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
				{#if text.length <= 0}
					<div>
						{#if $auth.accessToken}
							<WelcomeMicrophone onTranscription={(t: string) => (text = t)} />
						{:else}
							<button
								type="button"
								class="p-1.5 sm:p-2 size-10 sm:size-11 lg:size-12 border rounded-full flex items-center justify-center hover:bg-gray-100"
								onclick={() => onOpenCreateAccount?.()}
								aria-label="Use voice – create an account"
							>
								<Mic class="size-4 sm:size-5 text-black" />
							</button>
						{/if}
					</div>
				{/if}

				<!-- Send button  -->
				{#if text.length > 0 && !$isRecording && !$isTranscribing}
					<button
						class="p-1.5 sm:p-2 size-10 sm:size-11 lg:size-12 border rounded-full hover:bg-gray-100 flex items-center justify-center"
						disabled={$sendingMessage}
						onclick={() => handleSend()}
					>
						{#if $sendingMessage}
							<Spinner color="black" size="md" />
						{:else}
							<img src={send} class="size-4 sm:size-5" alt="send icon" />
						{/if}
					</button>
				{/if}
			</div>
		</div>

		<!-- QUICK LINKS  -->
		<div
			class="mt-3 lg:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:flex justify-center items-center gap-3 sm:gap-4 lg:gap-5 w-full"
		>
			<button
				class="shadow-none lg:shadow-md rounded-[100px] flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-4 py-3 w-full bg-white"
				onclick={() =>
					handleSend(
						"I want to write a story, but I'm not sure where to start. Can you ask me some questions to help me get started and then help me write it?",
						'STORY'
					)}
				disabled={$sendingMessage}
			>
				<img src={book} alt="book" width="20" height="20" />
				<p class="text-[13px] sm:text-[14px] lg:font-normal text-[#667085]">Write a Story</p>
			</button>
			<button
				class="shadow-none lg:shadow-md rounded-[100px] flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-4 py-3 w-full bg-white"
				onclick={() =>
					handleSend(
						"I'd like to have a chat about my career. I'm at a crossroads and could use some help exploring my options. Can you ask me some questions to understand my situation better?"
					)}
				disabled={$sendingMessage}
			>
				<img src={chat} alt="chat" width="20" height="20" />
				<p class="text-[13px] sm:text-[14px] lg:font-normal text-[#667085]">Career Chat</p>
			</button>
			<button
				class="shadow-none lg:shadow-md rounded-[100px] flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-4 py-3 w-full bg-white"
				onclick={() =>
					handleSend(
						"I have an interview coming up and I'm feeling nervous. Can you help me prepare by running through some common interview questions and giving me feedback?",
						'INTERVIEW_PREP'
					)}
				disabled={$sendingMessage}
			>
				<img src={album} alt="album" width="20" height="20" />
				<p class="text-[13px] sm:text-[14px] lg:font-normal text-[#667085]">Interview Prep</p>
			</button>
		</div>
	</div>

	<p class="text-[14px] font-normal text-[#686868]">
		By messaging RafikiX, you agree to our
		<a
			href="/terms-and-conditions"
			class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text hover:underline cursor-pointer"
			>Terms and Conditions</a
		>
	</p>
</div>
