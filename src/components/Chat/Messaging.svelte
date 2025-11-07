<script lang="ts">
	import { tick } from 'svelte';
	import { chatStore, messages, sendingMessage } from '$lib/stores/chatStore';
	import send from '$lib/assets/icons/send.svg';
	import search from '$lib/assets/icons/search.svg';
	import paperclip from '$lib/assets/icons/paperclip.png';
	import botLogo from '$lib/assets/icons/botLogo.png';
	import copyIcon from '$lib/assets/icons/copyIcon.png';
	import like from '$lib/assets/icons/likeIcon.png';
	import thumDown from '$lib/assets/icons/thumbDown.png';
	import megaphone from '$lib/assets/icons/megaphone.png';
	import mic from '$lib/assets/icons/mic.png';
	import MarkdownContent from './MarkdownContent.svelte';
	import Typewriter from './Typewriter.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { page } from '$app/state';
	import type { Message } from '$lib/types/chat';

	let newMessage = '';
	let selectedFile: File | null = null;
	let fileInput: HTMLInputElement;
	let chatContainer: HTMLDivElement;
	let hasSentMessage = false;

	async function handleSend() {
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
		hasSentMessage = true;
	}

	function triggerFileUpload() {
		fileInput.click();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			selectedFile = target.files[0];
		}
	}

	$: console.log($messages);

	async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
		}
	}

	$: if ($messages) {
		scrollToBottom();
	}
</script>

<div class="flex flex-col justify-between gap-20 h-[86vh] font-mulish font-medium">
	<!--Chat area-->
	<div class="flex-1 overflow-y-auto lg:p-5 space-y-4 bg-white" bind:this={chatContainer}>
		{#each $messages as msg, i}
			<div class="flex {msg.role === 'USER' ? 'justify-end' : 'justify-start'}">
				<div class="px-4 py-2 max-w-[70%]">
					{#if msg.role === 'ASSISTANT'}
						<div class="flex gap-4 items-start">
							<img src={botLogo} width="16" height="16" class="object-contain" alt="bot logo" />
							<div class="space-y-2">
								<!-- Content  -->
								<div class="px-4 py-2 text-sm rounded-lg rounded-bl-none text-[#808990]">
									{#if i === $messages.length - 1 && hasSentMessage}
										<Typewriter text={msg.content} />
									{:else}
										<MarkdownContent raw={msg.content} />
									{/if}
								</div>
								<!-- Icons  -->
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
									<img
										src={megaphone}
										width="16"
										height="16"
										class="cursor-pointer"
										alt="mega phone"
									/>
								</div>
							</div>
						</div>
					{:else}
						<div class="flex flex-col">
							<p class="px-4 py-2 text-sm rounded-lg bg-[#F7F6F5] rounded-br-none">{msg.content}</p>
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
	</div>
	<!-- Input Area -->
	<div class="sticky bottom-0 bg-white flex flex-col gap-4">
		<div class="border border-[#E8E8E8] rounded-[20px] p-4 bg-white shadow-md">
			<div class="flex flex-col px-3 py-2 gap-4">
				<div class="flex">
					<img src={search} class="ml-2" width="16" height="16" alt="Search Icon" />
					<!-- Text Input -->
					<input
						type="text"
						placeholder="Ask Rafiki..."
						bind:value={newMessage}
						class="flex-1 px-2 text-sm bg-transparent outline-none"
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
						<button
							class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100"
							onclick={handleSend}
						>
							<img src={mic} class="mx-auto" width="20" height="20" alt="mic icon" />
						</button>
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
		<p class="font-satoshi-regular font-light text-[14px] text-[#686868] self-center">
			By messaging RafikiX, you agree to our Terms and Conditions
		</p>
	</div>
</div>
