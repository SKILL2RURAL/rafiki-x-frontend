<script lang="ts">
	import {
		chatStore,
		isRecording,
		isTranscribing,
		newMessage,
		messages,
		sendingMessage
	} from '$lib/stores/chatStore';
	import { auth } from '$lib/stores/authStore';
	import { guestRemainingMessages } from '$lib/stores/chatStore';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import Microphone from './Microphone.svelte';
	import send from '$lib/assets/icons/send.svg';
	import search from '$lib/assets/icons/search.svg';
	import paperclip from '$lib/assets/icons/paperclip.png';
	import pdf from '$lib/assets/icons/pdf.png';
	import image from '$lib/assets/icons/image.png';
	import check from '$lib/assets/icons/check.png';
	import { X } from 'lucide-svelte';
	import type { Message } from '$lib/types/chat';
	import GuestToast from './GuestToast.svelte';

	let selectedFile: File | null = $state(null);
	let fileInput: HTMLInputElement | null = $state(null);
	let fileKeys: string[] = [];
	let uploadingFile = $state(false);
	let microphone: Microphone | null = $state(null);
	let showGuestToast = $state(true);
	let dotCount = $state(0);

	$effect(() => {
		if ($isRecording || $isTranscribing) {
			const dotSequence = [1, 2, 3, 4, 5, 6, 0];
			let sequenceIndex = 0;
			dotCount = dotSequence[sequenceIndex];

			const interval = setInterval(() => {
				sequenceIndex = (sequenceIndex + 1) % dotSequence.length;
				dotCount = dotSequence[sequenceIndex];
			}, 300); // Change dot count every 300ms

			return () => {
				clearInterval(interval);
				dotCount = 0;
			};
		} else {
			dotCount = 0; // Reset when not recording/transcribing
		}
	});

	function getDots(count: number): string {
		return '.'.repeat(count);
	}

	function triggerFileUpload() {
		fileInput?.click();
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		const value = (bytes / Math.pow(1024, i)).toFixed(2);
		return `${value} ${sizes[i]}`;
	}

	async function handleFileChange(event: Event) {
		uploadingFile = true;
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			if (target.files[0].size > 5 * 1024 * 1024) {
				toast.error('File size limit is 5MB');
				uploadingFile = false;
				return;
			}
			selectedFile = target.files[0];
			const fileUploadResponse = await chatStore.uploadFileForChat(selectedFile);
			fileKeys.push(fileUploadResponse.fileKey);
			uploadingFile = false;
		}
	}

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
		chatStore.setNewMessage('');
		selectedFile = null;
		fileKeys = [];

		const isLoggedIn =
			typeof localStorage !== 'undefined' ? !!localStorage.getItem('accessToken') : false;
		if (isLoggedIn) {
			chatStore.getConversations({});
		}
	}
</script>

<div class="flex flex-col gap-4">
	{#if $guestRemainingMessages !== null && $guestRemainingMessages > 0 && showGuestToast}
		<GuestToast
			remainingMessages={$guestRemainingMessages}
			onClose={() => (showGuestToast = false)}
		/>
	{/if}
	<div class="border border-[#E8E8E8] rounded-[20px] p-2 lg:p-4 bg-white shadow-md">
		<div class="flex flex-col px-2 lg:px-3 py-2 gap-4">
			<div class="flex">
				{#if $isRecording}
					<p class="text-[#80899A] text-[16px] font-medium animate-pulse repeat-infinite">
						Listening{getDots(dotCount)}
					</p>
				{:else if $isTranscribing}
					<p class="text-[#80899A] text-[16px] font-medium animate-pulse repeat-infinite">
						Analyzing your input{getDots(dotCount)}
					</p>
				{:else}
					<img src={search} class="ml-2" width="16" height="16" alt="Search Icon" />
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
				<div class="flex gap-2 items-center">
					{#if selectedFile}
						<div
							class={cn(
								'bg-linear-to-r from-[#51A3DA]/10 to-[#60269E]/10 border-[0.4px] border-[#C8CCD0] rounded-xl p-5 py-3 flex gap-5',
								{ 'opacity-50': uploadingFile }
							)}
						>
							<div class="flex items-center gap-3">
								{#if selectedFile.type.startsWith('image')}
									<img src={image} class="size-10 object-contain" alt="selected file" />
								{:else}
									<img src={pdf} class="size-10 object-contain" alt="selected file" />
								{/if}
								<div>
									<p class="text-sm font-medium max-w-[500px] truncate">{selectedFile.name}</p>
									<p class="text-[#4D5154] text-[14px] font-normal">
										{formatFileSize(selectedFile.size)}
									</p>
								</div>
							</div>
							<button
								class="size-5 rounded-full bg-white flex items-center justify-center cursor-pointer"
								onclick={() => (selectedFile = null)}
							>
								<X size={18} />
							</button>
						</div>
					{:else}
						<button
							onclick={triggerFileUpload}
							class="p-2 size-10 md:size-12 border rounded-full hover:bg-gray-100"
						>
							<img src={paperclip} class="mx-auto w-4 h-4 md:w-5 md:h-5" alt="file picker" />
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
								onclick={() => microphone?.cancelRecording()}
								class="size-10 md:size-[45px] border border-[#E2E2E2] flex items-center justify-center rounded-full hover:bg-gray-100"
							>
								<X class="w-4 h-4 md:w-[18px] md:h-[18px]" />
							</button>
							<button
								onclick={() => microphone?.stopRecording()}
								class="size-10 md:size-[45px] border border-[#E2E2E2] flex items-center justify-center rounded-full hover:bg-gray-100"
							>
								<img src={check} alt="" class="w-4 h-4 md:w-[18px] md:h-[18px]" />
							</button>
						</div>
					{/if}

					{#if $newMessage.length > 0 && !$isRecording && !$isTranscribing}
						<button
							disabled={$sendingMessage || $newMessage.length === 0 || uploadingFile}
							class="p-2 size-10 md:size-12 border rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-30"
							onclick={handleSend}
						>
							{#if $sendingMessage}
								<Spinner color="black" size="lg" />
							{:else}
								<img src={send} class="mx-auto w-4 h-4 md:w-5 md:h-5" alt="send icon" />
							{/if}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
