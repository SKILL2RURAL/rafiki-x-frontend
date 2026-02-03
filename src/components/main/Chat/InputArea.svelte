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
	import { Mic, X } from 'lucide-svelte';
	import GuestToast from './GuestToast.svelte';
	import { getDots, formatFileSize } from './inputArea.utils';
	import {
		sendChatInputMessage,
		startDotCountAnimation,
		uploadChatFileFromInputChange
	} from './inputArea.actions';

	let { onOpenCreateAccount }: { onOpenCreateAccount?: () => void } = $props();

	let selectedFile: File | null = $state(null);
	let fileInput: HTMLInputElement | null = $state(null);
	let fileKeys: string[] = [];
	let uploadingFile = $state(false);
	let microphone: Microphone | null = $state(null);
	let showGuestToast = $state(true);
	let dotCount = $state(0);
	let textareaRef: HTMLTextAreaElement | null = $state(null);

	function resizeChatTextarea(el: HTMLTextAreaElement | null) {
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
	}

	$effect(() => {
		$newMessage;
		resizeChatTextarea(textareaRef);
	});

	$effect(() => {
		if ($isRecording || $isTranscribing) {
			return startDotCountAnimation((n) => (dotCount = n));
		} else {
			dotCount = 0; // Reset when not recording/transcribing
		}
	});
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
			<div class="flex items-end">
				{#if $isRecording}
					<p class="text-[#80899A] text-[16px] font-medium animate-pulse repeat-infinite py-2">
						Listening{getDots(dotCount)}
					</p>
				{:else if $isTranscribing}
					<p class="text-[#80899A] text-[16px] font-medium animate-pulse repeat-infinite py-2">
						Analyzing your input{getDots(dotCount)}
					</p>
				{:else}
					<img src={search} class="ml-2 shrink-0 mb-2" width="16" height="16" alt="Search Icon" />
					<textarea
						bind:this={textareaRef}
						placeholder="Ask Rafiki..."
						rows={1}
						class="min-h-[24px] max-h-[200px] resize-none px-2 py-2 text-sm bg-transparent outline-none w-full overflow-y-auto border-none focus:outline-none focus-visible:ring-0"
						value={$newMessage}
						oninput={(e: Event) => {
							const target = e.target as HTMLTextAreaElement;
							chatStore.setNewMessage(target.value);
							resizeChatTextarea(textareaRef);
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								sendChatInputMessage({
									toast,
									getIsSending: () => $sendingMessage,
									getGuestRemainingMessages: () => $guestRemainingMessages,
									onOpenCreateAccount,
									getMessageText: () => $newMessage,
									getMessages: () => $messages,
									setMessages: (msgs) => chatStore.setMessages(msgs),
									sendGuestMessage: (m) => chatStore.sendGuestMessage(m),
									sendMessage: (payload) => chatStore.sendMessage(payload),
									chatId: Number(page.params.chatId),
									getSelectedFile: () => selectedFile,
									getFileKeys: () => fileKeys,
									resetAfterSend: () => {
										chatStore.setNewMessage('');
										selectedFile = null;
										fileKeys = [];
									},
									setShowGuestToast: (v) => (showGuestToast = v),
									refreshConversations: () => chatStore.getConversations({})
								});
							}
						}}
					></textarea>
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
								onclick={() => {
									selectedFile = null;
									fileKeys = [];
								}}
							>
								<X size={18} />
							</button>
						</div>
					{:else}
						<button
							onclick={() => fileInput?.click()}
							class="p-2 size-10 md:size-12 border rounded-full hover:bg-gray-100"
						>
							<img src={paperclip} class="mx-auto w-4 h-4 md:w-5 md:h-5" alt="file picker" />
						</button>
						<input
							type="file"
							class={'hidden'}
							accept=".pdf,.doc,.docx"
							bind:this={fileInput}
							onchange={(event) =>
								uploadChatFileFromInputChange({
									event,
									toast,
									setUploading: (v) => (uploadingFile = v),
									setSelectedFile: (f) => (selectedFile = f),
									setFileKeys: (keys) => (fileKeys = keys),
									uploadFileForChat: (file) => chatStore.uploadFileForChat(file)
								})}
						/>
					{/if}
				</div>

				<div class="flex items-center gap-5">
					{#if $auth.accessToken}
						<Microphone bind:this={microphone} conversationId={Number(page.params.chatId)} />
					{:else}
						<button
							type="button"
							class="p-2 size-10 md:size-12 border rounded-full hover:bg-gray-100 flex items-center justify-center"
							onclick={() => onOpenCreateAccount?.()}
							aria-label="Use voice – create an account"
						>
							<Mic class="w-4 h-4 md:w-5 md:h-5 text-black" />
						</button>
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
							onclick={() =>
								sendChatInputMessage({
									toast,
									getIsSending: () => $sendingMessage,
									getGuestRemainingMessages: () => $guestRemainingMessages,
									onOpenCreateAccount,
									getMessageText: () => $newMessage,
									getMessages: () => $messages,
									setMessages: (msgs) => chatStore.setMessages(msgs),
									sendGuestMessage: (m) => chatStore.sendGuestMessage(m),
									sendMessage: (payload) => chatStore.sendMessage(payload),
									chatId: Number(page.params.chatId),
									getSelectedFile: () => selectedFile,
									getFileKeys: () => fileKeys,
									resetAfterSend: () => {
										chatStore.setNewMessage('');
										selectedFile = null;
										fileKeys = [];
									},
									setShowGuestToast: (v) => (showGuestToast = v),
									refreshConversations: () => chatStore.getConversations({})
								})}
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
