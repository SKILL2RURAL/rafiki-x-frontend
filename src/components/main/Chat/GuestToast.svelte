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
		in:fly={{ y: 40, duration: 250 }}
		out:fly={{ y: 40, duration: 200 }}
		class="self-center bg-gradient text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-md"
	>
		<span class="text-sm"
			>You have {remainingMessages} messages left, log in to send unlimited messages</span
		>
		<button
			class="size-[24px] rounded-full bg-white/20 flex items-center justify-center"
			onclick={() => {
				visible = false;
				onClose?.();
			}}
			aria-label="Close"
		>
			<X color="white" size={16} />
		</button>
	</div>
{/if}
