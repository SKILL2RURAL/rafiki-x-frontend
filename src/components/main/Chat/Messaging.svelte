<script lang="ts">
	import { tick } from 'svelte';
	import { messages, sendingMessage } from '$lib/stores/chatStore';
	import botLogo from '$lib/assets/icons/logo-gradient.png';
	// import megaphone from '$lib/assets/icons/megaphone.png';
	// import mic from '$lib/assets/icons/mic.png';
	import AssistantMessage from './AssistantMessage.svelte';
	import UserMessage from './UserMessage.svelte';
	import InputArea from './InputArea.svelte';
	import type { Message } from '$lib/types/chat';
	// import { toast } from 'svelte-sonner';
	// import Microphone from './Microphone.svelte';
	// import check from '$lib/assets/icons/check.png';
	// import pdf from '$lib/assets/icons/pdf.png';
	// import image from '$lib/assets/icons/image.png';
	import { X } from 'lucide-svelte';
	// import { cn } from '$lib/utils';
	import { guestRemainingMessages } from '$lib/stores/chatStore';
	import CreateAccountModal from '../Layout/CreateAccountModal.svelte';
	// import GuestToast from './GuestToast.svelte';
	// import { auth } from '$lib/stores/authStore';

	let scrollAnchor: HTMLDivElement | null = $state(null);
	let isCreateAccountOpen = $state(false);

	$effect(() => {
		if ($guestRemainingMessages === 0) {
			isCreateAccountOpen = true;
		}
	});

	// async function scrollToBottom() {
	// 	await tick();
	// 	scrollAnchor?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	// }

	// $: if ($messages) {
	// 	scrollToBottom();
	// }
</script>

<div
	class="flex flex-col mx-auto justify-between font-mulish font-medium lg:max-w-[70vw] h-full relative"
>
	<!--Chat area-->
	<div class="space-y-4 grow pb-[200px]">
		{#each $messages as msg, i}
			<div class="flex {msg.role === 'USER' ? 'justify-end' : 'justify-start'}">
				<div class="px-4 py-2 w-[70vw] lg:max-w-[50vw]">
					{#if msg.role === 'ASSISTANT'}
						<AssistantMessage {msg} />
					{:else}
						<UserMessage {msg} />
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
	<div class="sticky bottom-0 lg:-bottom-5 bg-white w-full lg:w-[71vw] px-5">
		<InputArea />
		<p class="text-[#686868] text-center text-[14px] font-normal py-3">
			By messaging RafikiX, you agree to our Terms and Conditions
		</p>
	</div>

	<!-- CREATE ACCOUNT MODAL  -->
	<CreateAccountModal isOpen={isCreateAccountOpen} onClose={() => (isCreateAccountOpen = false)} />
</div>
