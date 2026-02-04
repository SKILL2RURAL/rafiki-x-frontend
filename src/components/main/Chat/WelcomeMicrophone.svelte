<script lang="ts">
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { chatStore, isRecording, isTranscribing, sendingMessage } from '$lib/stores/chatStore';
	import { cn } from '$lib/utils';
	import { Mic } from 'lucide-svelte';
	import { createMicrophoneRecorder } from './microphone.controller';
	import check from '$lib/assets/icons/check.png';
	import { X } from 'lucide-svelte';

	let volume = $state(0);
	let { onTranscription }: { onTranscription: (text: string) => void } = $props();

	const recorder = createMicrophoneRecorder({
		chatStore,
		getNewMessage: () => '',
		getIsRecording: () => $isRecording,
		setVolume: (v) => (volume = v),
		getOnTranscription: () => onTranscription
	});

	export function stopRecording() {
		recorder.stop();
	}

	export function cancelRecording() {
		recorder.cancel();
	}
</script>

<div class="flex items-center gap-1.5 sm:gap-2">
	<div
		class={cn(
			'rounded-full transition-all duration-100 ease-linear',
			$isRecording && 'bg-[#EEF6FB]'
		)}
		style="padding: {$isRecording ? volume * 20 : 0}px;"
	>
		<button
			class={cn(
				'p-1.5 sm:p-2 size-10 sm:size-11 lg:size-12 border rounded-full flex items-center justify-center hover:bg-gray-100',
				$isRecording && 'bg-gradient'
			)}
			onclick={() => recorder.start()}
			disabled={$isRecording || $isTranscribing || $sendingMessage}
		>
			{#if $isTranscribing}
				<Spinner color="black" size="md" />
			{:else}
				<Mic color={$isRecording ? 'white' : 'black'} class="size-4 sm:size-5" />
			{/if}
		</button>
	</div>
	{#if $isRecording}
		<button
			class="size-10 sm:size-11 lg:size-12 border border-[#E2E2E2] flex items-center justify-center rounded-full hover:bg-gray-100 text-[#60269E]"
			onclick={() => cancelRecording()}
			aria-label="Cancel recording"
		>
			<X class="size-4 sm:size-5" />
		</button>
		<button
			class="size-10 sm:size-11 lg:size-12 border border-[#E2E2E2] flex items-center justify-center rounded-full hover:bg-gray-100"
			onclick={() => stopRecording()}
			aria-label="Stop and send"
		>
			<img src={check} alt="" class="size-4 sm:size-5" />
		</button>
	{/if}
</div>
