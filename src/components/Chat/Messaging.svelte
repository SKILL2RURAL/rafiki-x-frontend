<script lang="ts">
	import { tick } from 'svelte';
	import { chatStore, messages, sendingMessage } from '$lib/stores/chatStore';
	import send from '$lib/assets/icons/send.svg';
	import search from '$lib/assets/icons/search.svg';
	import paperclip from '$lib/assets/icons/paperclip.png';
	import botLogo from '$lib/assets/icons/logo-gradient.png';
	import copyIcon from '$lib/assets/icons/copyIcon.png';
	import like from '$lib/assets/icons/likeIcon.png';
	import thumDown from '$lib/assets/icons/thumbDown.png';
	import megaphone from '$lib/assets/icons/megaphone.png';
	// import mic from '$lib/assets/icons/mic.png';
	import MarkdownContent from './MarkdownContent.svelte';
	import Typewriter from './Typewriter.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { page } from '$app/state';
	import type { Message } from '$lib/types/chat';
	import { toast } from 'svelte-sonner';
	import Microphone from './Microphone.svelte';

	let newMessage = '';
	let selectedFile: File | null = null;
	let fileInput: HTMLInputElement;
	let scrollAnchor: HTMLDivElement;

	async function handleSend() {
		if (!newMessage.trim()) {
			toast.error('Please enter a message');
			return;
		}

		const updatedMessage: Message[] = [...$messages];

		updatedMessage.push({
			id: new Date().getTime(),
			role: 'USER',
			content: newMessage.trim(),
			createdAt: new Date().toISOString()
		});

		chatStore.setMessages(updatedMessage);

		chatStore.sendMessage({
			message: newMessage.trim(),
			createNewConversation: false,
			conversationId: Number(page.params.chatId)
		});
		newMessage = '';
	}

	function sendVoiceNote() {}

	function triggerFileUpload() {
		fileInput.click();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			selectedFile = target.files[0];
		}
	}

	async function scrollToBottom() {
		await tick();
		scrollAnchor?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}

	$: if ($messages) {
		scrollToBottom();
	}
</script>

<div class="flex-1 flex-col mx-auto justify-between font-mulish font-medium lg:max-w-[70vw] h-full">
	<!--Chat area-->
	<div class="space-y-4 grow pb-[200px]">
		{#each $messages as msg, i}
			<div class="flex {msg.role === 'USER' ? 'justify-end' : 'justify-start'}">
				<div class="px-4 py-2 w-[70vw] lg:max-w-[50vw]">
					{#if msg.role === 'ASSISTANT'}
						<div class="flex gap-3 items-start">
							<img src={botLogo} width="16" height="16" class="object-contain" alt="bot logo" />
							<div class="space-y-2">
								<!-- Content  -->
								<div class="text-sm rounded-lg rounded-bl-none w-[70vw] lg:w-[50vw]">
									{#if msg.isTyping}
										<Typewriter
											text={msg.content}
											on:typingComplete={() => chatStore.setMessageTypingStatus(msg.id!, false)}
											on:tick={scrollToBottom}
										/>
									{:else}
										<MarkdownContent raw={msg.content} />
									{/if}
								</div>

								<!-- Icons  -->
								{#if !msg.isTyping}
									<div class="flex gap-4 items-center">
										<img
											src={copyIcon}
											width="16"
											height="16"
											class="cursor-pointer"
											alt="copy Icon"
										/>
										<img src={like} width="16" height="16" class="cursor-pointer" alt="Like Icon" />

										<img
											src={thumDown}
											width="16"
											height="16"
											class="cursor-pointer"
											alt="thumb down"
										/>
										<!-- <img
											src={megaphone}
											width="16"
											height="16"
											class="cursor-pointer"
											alt="mega phone"
										/> -->
									</div>
								{/if}
							</div>
						</div>
					{:else}
						<div class="flex flex-col items-end">
							<p
								class="px-4 py-2 text-[16px] font-[400] text-[#1a1a1a] rounded-lg bg-[#F7F6F5] rounded-br-none"
							>
								{msg.content}
							</p>
							<img
								src={copyIcon}
								class="self-end mt-1 cursor-pointer"
								width="16"
								height="16"
								alt="copy Icon"
							/>
						</div>
					{/if}
				</div>
			</div>
		{/each}
		{#if $sendingMessage}
			<div class="flex justify-start">
				<div class="px-4 py-2 w-[70vw] lg:max-w-[50vw]">
					<div class="flex gap-4 items-start">
						<img src={botLogo} width="16" height="16" class="object-contain" alt="bot logo" />
						<div class="space-y-2">
							<div
								class="px-4 text-sm rounded-lg rounded-bl-none text-[#808990] animate-pulse-opacity"
							>
								RafikiBot is thinking...
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div bind:this={scrollAnchor}></div>

	<!-- Input Area -->
	<div class="fixed bg-white bottom-10 w-[90vw] sm:w-[95vw] lg:w-[70vw] flex flex-col gap-4">
		<div class="border border-[#E8E8E8] rounded-[20px] p-4 bg-white shadow-md">
			<div class="flex flex-col px-3 py-2 gap-4">
				<div class="flex">
					<img src={search} class="ml-2" width="16" height="16" alt="Search Icon" />
					<!-- Text Input -->
					<input
						type="text"
						placeholder="Ask Rafiki..."
						bind:value={newMessage}
						class=" px-2 text-sm bg-transparent outline-none w-full"
						onkeydown={(e) => e.key === 'Enter' && handleSend()}
					/>
				</div>

				<div class="flex justify-between">
					<!-- File Upload Button -->
					<div class="flex gap-2 items-center">
						<button
							onclick={triggerFileUpload}
							class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100"
						>
							<img src={paperclip} class="mx-auto" width="20" height="20" alt="file picker" />
						</button>
						<input
							type="file"
							class={selectedFile ? 'flex' : 'hidden'}
							bind:this={fileInput}
							onchange={handleFileChange}
						/>
					</div>
					{#if newMessage.length === 0}
						<!-- Mic Button -->
						<Microphone on:click={sendVoiceNote} />
					{:else}
						<button
							class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100 flex items-center justify-center"
							onclick={handleSend}
						>
							{#if $sendingMessage}
								<Spinner color="black" size="lg" />
							{:else}
								<img src={send} class="mx-auto" width="20" height="20" alt="send icon" />
							{/if}
						</button>
					{/if}
				</div>
			</div>
		</div>
		<!-- <p class="font-satoshi-regular font-light text-[14px] text-[#686868] self-center">
			By messaging RafikiX, you agree to our Terms and Conditions
		</p> -->
	</div>
</div>
