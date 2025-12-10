<script lang="ts">
	import { tick } from 'svelte';
	import {
		chatStore,
		isRecording,
		messages,
		sendingMessage,
		isTranscribing,
		newMessage
	} from '$lib/stores/chatStore';
	import send from '$lib/assets/icons/send.svg';
	import search from '$lib/assets/icons/search.svg';
	import paperclip from '$lib/assets/icons/paperclip.png';
	import botLogo from '$lib/assets/icons/logo-gradient.png';
	import copyIcon from '$lib/assets/icons/copyIcon.png';
	// import megaphone from '$lib/assets/icons/megaphone.png';
	// import mic from '$lib/assets/icons/mic.png';
	import MarkdownContent from './MarkdownContent.svelte';
	import Typewriter from './Typewriter.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { page } from '$app/state';
	import type { Message } from '$lib/types/chat';
	import { toast } from 'svelte-sonner';
	import Microphone from './Microphone.svelte';
	import check from '$lib/assets/icons/check.png';
	import pdf from '$lib/assets/icons/pdf.png';
	import image from '$lib/assets/icons/image.png';
	import { X } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { guestRemainingMessages } from '$lib/stores/chatStore';
	import CreateAccountModal from '../Layout/CreateAccountModal.svelte';
	import GuestToast from './GuestToast.svelte';
	import { auth } from '$lib/stores/authStore';

	let selectedFile: File | null = $state(null);
	let fileInput: HTMLInputElement;
	let scrollAnchor: HTMLDivElement;
	let fileKeys: string[] = [];
	let uploadingFile = $state(false);
	let microphone: Microphone;
	let showGuestToast = $state(true);
	let isCreateAccountOpen = $state(false);

	$effect(() => {
		if ($guestRemainingMessages === 0) {
			isCreateAccountOpen = true;
		}
	});

	async function copyText(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied to clipboard');
		} catch (e) {
			toast.error('Failed to copy');
		}
	}

	import MessageFeedback from './MessageFeedback.svelte';

	async function handleSend() {
		if ($sendingMessage) return;

		if (!$newMessage.trim()) {
			toast.error('Please enter a message');
			return;
		}

		const updatedMessage: Message[] = [...$messages];

		const newUserMsg: Message = {
			id: new Date().getTime(),
			role: 'USER',
			content: $newMessage.trim(),
			createdAt: new Date().toISOString()
		};
		if (selectedFile) {
			newUserMsg.attachments = [
				{
					originalFileName: selectedFile.name,
					fileSize: selectedFile.size,
					fileType: selectedFile.type
				}
			];
		}

		updatedMessage.push(newUserMsg);

		chatStore.setMessages(updatedMessage);

		// SEND MESSAGE
		const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
		if (!token) {
			await chatStore.sendGuestMessage($newMessage.trim());
			showGuestToast = true;
		} else {
			chatStore.sendMessage({
				message: $newMessage.trim(),
				createNewConversation: false,
				conversationId: Number(page.params.chatId),
				fileKeys
			});
		}

		// RESET STATE
		chatStore.setNewMessage('');
		selectedFile = null;
		fileKeys = [];

		// GET CONVERSATIONS AGAIN (only for authenticated)
		const isLoggedIn =
			typeof localStorage !== 'undefined' ? !!localStorage.getItem('accessToken') : false;
		if (isLoggedIn) {
			chatStore.getConversations({});
		}
	}

	function triggerFileUpload() {
		fileInput.click();
	}

	async function handleFileChange(event: Event) {
		uploadingFile = true;
		const target = event.target as HTMLInputElement;

		// CHECK IF THERE ARE FILES TO UPLOAD
		if (target.files && target.files.length > 0) {
			// CHECK THE SIZE OF THE IMAGE TO UPLOAD
			if (target.files[0].size > 5 * 1024 * 1024) {
				toast.error('File size limit is 5MB');
				uploadingFile = false;
				return;
			}

			selectedFile = target.files[0];
			// UPLOAD FILE
			const fileUploadResponse = await chatStore.uploadFileForChat(selectedFile);
			fileKeys.push(fileUploadResponse.fileKey);
			uploadingFile = false;
		}
	}

	async function scrollToBottom() {
		await tick();
		scrollAnchor?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';

		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		const value = (bytes / Math.pow(1024, i)).toFixed(2);

		return `${value} ${sizes[i]}`;
	}

	// $: if ($messages) {
	// 	scrollToBottom();
	// }
</script>

<div
	class="flex-1 flex-col mx-auto justify-between font-mulish font-medium lg:max-w-[70vw] h-full relative"
>
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
									<div class="flex items-center">
										<Tooltip.Provider>
											<Tooltip.Root>
												<Tooltip.Trigger
													class="hover:bg-gray-100 rounded-lg p-2"
													aria-label="Copy"
													onclick={() => copyText(msg.content)}
												>
													<img
														src={copyIcon}
														class="self-end cursor-pointer"
														width="15"
														height="15"
														alt="copy Icon"
													/></Tooltip.Trigger
												>
												<Tooltip.Content side="bottom">
													<p>Copy</p>
												</Tooltip.Content>
											</Tooltip.Root>
										</Tooltip.Provider>

										<MessageFeedback
											messageId={msg.id}
											isTyping={msg.isTyping}
											feedback={msg.feedback}
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
						<div>
							<div>
								{#if msg.attachments && msg.attachments.length > 0}
									<div class="mb-2 flex items-end justify-end">
										<div
											class="bg-[#F7F6F5] rounded-l-[10px] rounded-tr-[34px] rounded-br-[10px] p-4 flex items-center gap-3"
										>
											{#if msg.attachments && msg.attachments[0].fileType?.startsWith('image')}
												<img
													src={image}
													class="w-[40px] h-[40px] object-contain"
													alt="selected file"
												/>
											{:else}
												<img
													src={pdf}
													class="w-[40px] h-[40px] object-contain"
													alt="selected file"
												/>
											{/if}
											<div class="pr-[12px]">
												<p class="text-sm font-medium max-w-[500px] truncate">
													{msg.attachments[0].originalFileName}
												</p>
												<p class="text-[#4D5154] text-[14px] font-normal">
													{formatFileSize(msg.attachments[0].fileSize || 0)}
												</p>
											</div>
										</div>
									</div>
								{/if}

								<div class="flex flex-col items-end">
									<p
										class="px-4 py-2 pr-7 text-[16px] font-normal text-[#1a1a1a] rounded-lg rounded-tr-[34px] bg-[#F7F6F5] rounded-br-none mb-2"
									>
										{msg.content}
									</p>

									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger
												class="hover:bg-gray-100 rounded-lg p-2"
												aria-label="Copy"
												onclick={() => copyText(msg.content)}
											>
												<img
													src={copyIcon}
													class="self-end cursor-pointer"
													width="15"
													height="15"
													alt="copy Icon"
												/></Tooltip.Trigger
											>
											<Tooltip.Content side="bottom">
												<p>Copy</p>
											</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
								</div>
							</div>
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
	<div
		class="fixed bg-white bottom-5 lg:bottom-15 w-[80vw] sm:w-[90vw] lg:w-[70vw] flex flex-col gap-4"
	>
		{#if $guestRemainingMessages !== null && $guestRemainingMessages > 0 && showGuestToast}
			<GuestToast
				remainingMessages={$guestRemainingMessages}
				onClose={() => (showGuestToast = false)}
			/>
		{/if}
		<div class="border border-[#E8E8E8] rounded-[20px] p-4 bg-white shadow-md">
			<div class="flex flex-col px-3 py-2 gap-4">
				<div class="flex">
					{#if $isRecording}
						<p class="text-[#80899A] text-[16px] font-medium">Listening........</p>
					{:else if $isTranscribing}
						<p class="text-[#80899A] text-[16px] font-medium">Gathering thoughts........</p>
					{:else}
						<img src={search} class="ml-2" width="16" height="16" alt="Search Icon" />
						<!-- Text Input -->
						<input
							type="text"
							placeholder="Ask Rafiki..."
							value={$newMessage}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								chatStore.setNewMessage(target.value);
							}}
							class=" px-2 text-sm bg-transparent outline-none w-full"
							onkeydown={(e) => e.key === 'Enter' && handleSend()}
						/>
					{/if}
				</div>

				<div class="flex justify-between">
					<!-- File Upload Button -->
					<div class="flex gap-2 items-center">
						{#if selectedFile}
							<div
								class={cn(
									'bg-linear-to-r from-[#51A3DA]/10 to-[#60269E]/10 border-[0.4px] border-[#C8CCD0] rounded-[8px] p-5 py-3 flex gap-5',
									{ 'opacity-50': uploadingFile }
								)}
							>
								<div class="flex items-center gap-3">
									{#if selectedFile.type.startsWith('image')}
										<img src={image} class="w-[40px] h-[40px] object-contain" alt="selected file" />
									{:else}
										<img src={pdf} class="w-[40px] h-[40px] object-contain" alt="selected file" />
									{/if}
									<div>
										<p class="text-sm font-medium max-w-[500px] truncate">{selectedFile.name}</p>
										<p class="text-[#4D5154] text-[14px] font-normal">
											{formatFileSize(selectedFile.size)}
										</p>
									</div>
								</div>
								<button
									class="size-[20px] rounded-full bg-white flex items-center justify-center cursor-pointer"
									onclick={() => (selectedFile = null)}
								>
									<X size={18} />
								</button>
							</div>
						{:else}
							<button
								onclick={triggerFileUpload}
								class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100"
							>
								<img src={paperclip} class="mx-auto" width="20" height="20" alt="file picker" />
							</button>
							<input
								type="file"
								class={'hidden'}
								accept=".pdf,.doc,.docx"
								bind:this={fileInput}
								onchange={handleFileChange}
							/>
						{/if}
					</div>

					<div class="flex items-center gap-5">
						{#if $auth.accessToken}
							<Microphone bind:this={microphone} conversationId={Number(page.params.chatId)} />
						{/if}

						{#if $auth.accessToken && $isRecording}
							<div class="flex items-center gap-3">
								<button
									onclick={() => microphone.cancelRecording()}
									class="size-[45px] border border-[#E2E2E2] flex items-center justify-center rounded-full hover:bg-gray-100"
								>
									<X />
								</button>
								<button
									onclick={() => microphone.stopRecording()}
									class="size-[45px] border border-[#E2E2E2] flex items-center justify-center rounded-full hover:bg-gray-100"
								>
									<img src={check} alt="" width="18" height="18" />
								</button>
							</div>
						{/if}

						<!-- SEND BUTTON  -->
						{#if $newMessage.length > 0 && !$isRecording && !$isTranscribing}
							<button
								disabled={$sendingMessage || $newMessage.length === 0 || uploadingFile}
								class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-30"
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
		</div>
		<!-- <p class="font-satoshi-regular font-light text-[14px] text-[#686868] self-center">
			By messaging RafikiX, you agree to our Terms and Conditions
		</p> -->
	</div>
	<CreateAccountModal isOpen={isCreateAccountOpen} onClose={() => (isCreateAccountOpen = false)} />
</div>
