<script lang="ts">
	import { X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	let {
		remainingMessages,
		onClose,
		durationMs = 4000
	}: { remainingMessages: number; onClose?: () => void; durationMs?: number } = $props();
	let visible = $state(true);
	let timer: any;
	$effect(() => {
		if (visible) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				visible = false;
				onClose?.();
			}, durationMs);
		}
		return () => clearTimeout(timer);
	});
</script>

{#if visible}
	<div
		in:fly={{ y: 40 }}
		out:fly={{ y: 40 }}
		class="mx-auto bg-gradient text-white rounded-full px-3 sm:px-4 py-2 flex items-center sm:gap-3 gap-2 shadow-md w-full sm:w-auto max-w-[90vw]"
	>
		<span class="text-[12px] sm:text-sm text-center"
			>You have {remainingMessages} messages left, log in to send unlimited messages</span
		>
		<button
			class="size-[20px] sm:size-[24px] rounded-full bg-white/20 flex items-center justify-center shrink-0"
			onclick={() => {
				visible = false;
				onClose?.();
			}}
		>
			<X color="white" size={16} />
		</button>
	</div>
{/if}
