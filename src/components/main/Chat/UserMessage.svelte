<script lang="ts">
	import pdf from '$lib/assets/icons/pdf.png';
	import image from '$lib/assets/icons/image.png';
	import copyIcon from '$lib/assets/icons/copyIcon.png';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { toast } from 'svelte-sonner';
	import type { Message } from '$lib/types/chat';

	let { msg }: { msg: Message } = $props();

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		const value = (bytes / Math.pow(1024, i)).toFixed(2);
		return `${value} ${sizes[i]}`;
	}

	async function copyText(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied to clipboard');
		} catch {
			toast.error('Failed to copy');
		}
	}
</script>

<div>
	<div>
		{#if msg.attachments && msg.attachments.length > 0}
			<div class="mb-2 flex items-end justify-end">
				<div
					class="bg-[#F7F6F5] rounded-l-[10px] rounded-tr-[34px] rounded-br-[10px] p-4 flex items-center gap-3"
				>
					{#if msg.attachments && msg.attachments[0].fileType?.startsWith('image')}
						<img src={image} class="w-[40px] h-[40px] object-contain" alt="selected file" />
					{:else}
						<img src={pdf} class="w-[40px] h-[40px] object-contain" alt="selected file" />
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

