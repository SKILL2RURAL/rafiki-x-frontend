<script lang="ts">
	import botLogo from '$lib/assets/icons/logo-gradient.png';
	import copyIcon from '$lib/assets/icons/copyIcon.png';
	import MarkdownContent from './MarkdownContent.svelte';
	import Typewriter from './Typewriter.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import MessageFeedback from './MessageFeedback.svelte';
	import { toast } from 'svelte-sonner';
	import type { Message } from '$lib/types/chat';
	import { auth } from '$lib/stores/authStore';
	import { chatStore } from '$lib/stores/chatStore';

	let { msg }: { msg: Message } = $props();

	async function copyText(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied to clipboard');
		} catch {
			toast.error('Failed to copy');
		}
	}
</script>

<div class="flex gap-3 items-start">
	<img src={botLogo} width="16" height="16" class="object-contain" alt="bot logo" />
	<div class="space-y-2">
		<div class="text-sm rounded-lg rounded-bl-none w-[80vw] lg:w-[60vw]">
			{#if msg.isTyping}
				<Typewriter
					text={msg.content}
					on:typingComplete={() => chatStore.setMessageTypingStatus(msg.id!, false)}
				/>
			{:else}
				<MarkdownContent raw={msg.content} />
			{/if}
		</div>

		{#if !msg.isTyping}
			<div class="flex items-center">
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger
							class="hover:bg-gray-100 rounded-full p-2"
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

				{#if $auth.accessToken}
					<MessageFeedback messageId={msg.id} isTyping={msg.isTyping} feedback={msg.feedback} />
				{/if}
			</div>
		{/if}
	</div>
</div>
