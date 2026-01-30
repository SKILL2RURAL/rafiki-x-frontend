<script lang="ts">
	// import { tick } from 'svelte';
	import { messages, sendingMessage } from '$lib/stores/chatStore';
	import botLogo from '$lib/assets/icons/logo-gradient.png';

	import AssistantMessage from './AssistantMessage.svelte';
	import UserMessage from './UserMessage.svelte';
	import InputArea from './InputArea.svelte';
	import CreateAccountModal from '../Layout/CreateAccountModal.svelte';

	// let scrollAnchor: HTMLDivElement | null = $state(null);
	let chatContainer: HTMLDivElement | null = $state(null);
	let isCreateAccountOpen = $state(false);

	// async function scrollToBottom() {
	// 	await tick();

	// 	if (!chatContainer) return;
	// 	chatContainer?.scrollTo({
	// 		behavior: 'smooth',
	// 		top: chatContainer.scrollHeight - chatContainer.clientHeight - 80
	// 	});
	// }

	// $effect(() => {
	// 	// $messages;
	// 	console.log('Messages updated:', $messages);
	// 	scrollToBottom();
	// });
</script>

<div
	class="flex flex-col mx-auto justify-between font-mulish font-medium lg:max-w-[70vw] h-[70vh] relative"
>
	<!--Chat area-->
	<div
		class="space-y-4 grow pb-[200px] overflow-y-auto overscroll-contain no-scrollbar"
		bind:this={chatContainer}
	>
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
	<!-- <div bind:this={scrollAnchor}></div> -->

	<!-- Input Area -->
	<div class="fixed bottom-0 lg:bottom-5 bg-white w-full lg:w-[71vw] px-5">
		<InputArea onOpenCreateAccount={() => (isCreateAccountOpen = true)} />
		<p class="text-[#686868] text-center text-[11px] md:text-[14px] font-normal pb-5 md:pb-3 py-3">
			By messaging RafikiX, you agree to our <a
				href="/terms-and-conditions"
				class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text hover:underline cursor-pointer"
				>Terms and Conditions</a
			>
		</p>
	</div>

	<!-- CREATE ACCOUNT MODAL  -->
	<CreateAccountModal isOpen={isCreateAccountOpen} onClose={() => (isCreateAccountOpen = false)} />
</div>
