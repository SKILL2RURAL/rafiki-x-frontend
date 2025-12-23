<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { X } from 'lucide-svelte';

	let {
		isOpen,
		title,
		description,
		onClose,
		children
	}: {
		isOpen: boolean;
		title: string;
		description?: string;
		onClose: () => void;
		children?: any;
	} = $props();

	function handleOpenChange(value: boolean) {
		if (!value) onClose();
	}
</script>

<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
	<Dialog.Overlay class="bg-black/30 backdrop-blur-md" />
	<Dialog.Content
		showCloseButton={false}
		class="rounded-[20px] p-0 border-0 max-w-md bg-linear-to-b from-[#5449AC] via-[#FFFFFF00] to-[#FFFFFF00] from-2% via-40% to-60% text-white min-w-[35vw]"
	>
		<div class="p-6">
			<Dialog.Header>
				<Dialog.Title
					class="text-center text-[32px] font-bold uppercase tracking-wide"
					style="font-family: 'Impact', sans-serif;"
				>
					{title}
				</Dialog.Title>
				{#if description}
					<Dialog.Description class="text-center text-white text-[14px]">
						{description}
					</Dialog.Description>
				{/if}

				<button
					class="absolute right-5 top-7 bg-white rounded-full size-[32px] flex items-center justify-center"
					onclick={onClose}
				>
					<X class="text-black" size={20} />
				</button>
			</Dialog.Header>

			{@render children()}
		</div>
	</Dialog.Content>
</Dialog.Root>
