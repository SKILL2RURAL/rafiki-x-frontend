<script lang="ts">
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import {
		chatStore,
		isRecording,
		isTranscribing,
		newMessage,
		sendingMessage
	} from '$lib/stores/chatStore';
	import { cn } from '$lib/utils';
	import { Mic } from 'lucide-svelte';
	import { createMicrophoneRecorder } from './microphone.controller';

	export const conversationId: number | undefined = undefined;
	let volume = 0;
	const recorder = createMicrophoneRecorder({
		chatStore,
		getNewMessage: () => $newMessage,
		getIsRecording: () => $isRecording,
		setVolume: (v) => (volume = v)
	});

	export function stopRecording() {
		recorder.stop();
	}

	export function cancelRecording() {
		recorder.cancel();
	}
</script>

<div class="flex items-center gap-3">
	<div
		class={`bg-[#EEF6FB] rounded-full transition-all duration-100 ease-linear`}
		style="padding: {volume * 20}px;"
	>
		<button
			class={cn(
				`p-2 md:p-2 bg-white hover:bg-gray-100 flex items-center justify-center border rounded-full h-[40px] w-[40px] md:h-[48px] md:w-[48px]`,
				{
					'bg-gradient': $isRecording
				}
			)}
			onclick={() => recorder.start()}
			disabled={$isRecording || $isTranscribing || $sendingMessage}
		>
			{#if $isTranscribing}
				<Spinner color="black" />
			{:else}
				<Mic color={$isRecording ? 'white' : 'black'} class="w-4 h-4 md:w-5 md:h-5" />
			{/if}
		</button>
	</div>
</div>
