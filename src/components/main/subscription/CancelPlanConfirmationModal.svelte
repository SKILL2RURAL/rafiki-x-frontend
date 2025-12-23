<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { X } from 'lucide-svelte';

	let {
		isOpen = false,
		onClose = () => {},
		onConfirm = () => {}
	}: {
		isOpen?: boolean;
		onClose?: () => void;
		onConfirm?: () => void;
	} = $props();

	function handleOpenChange(value: boolean) {
		if (!value) onClose();
	}

	function handleConfirm() {
		onConfirm();
		onClose();
	}
</script>

<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
	<Dialog.Overlay class="bg-black/30 backdrop-blur-md" />
	<Dialog.Content
		showCloseButton={false}
		class="rounded-[20px] p-6 border-0 max-w-md bg-white"
	>
		<div class="relative">
			<!-- Title -->
			<h2 class="text-[24px] font-bold text-[#253B4B] mb-4">Cancel Plan</h2>

			<!-- Close Button -->
			<button
				class="absolute right-0 top-0 bg-gray-100 rounded-full size-8 flex items-center justify-center hover:bg-gray-200"
				onclick={onClose}
			>
				<X class="text-gray-600" size={18} />
			</button>

			<!-- Confirmation Message -->
			<p class="text-[#253B4B] text-[16px] mb-6">
				Are you sure you want to cancel your current plan?
			</p>

			<!-- Action Buttons -->
			<div class="flex gap-3 justify-end">
				<Button
					variant="outline"
					class="bg-white text-[#253B4B] border border-gray-300 rounded-[8px] h-[40px] px-6 hover:bg-gray-50"
					onclick={onClose}
				>
					Cancel
				</Button>
				<Button
					class="bg-red-600 text-white rounded-[8px] h-[40px] px-6 hover:bg-red-700"
					onclick={handleConfirm}
				>
					Yes, Cancel
				</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

