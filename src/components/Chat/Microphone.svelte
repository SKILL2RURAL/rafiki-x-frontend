<script lang="ts">
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { chatStore, isRecording, messages, isTranscribing } from '$lib/stores/chatStore';
	import type { Message } from '$lib/types/chat';
	import { cn } from '$lib/utils';
	import { Mic } from 'lucide-svelte';

	export let conversationId: number | undefined = undefined;

	let mediaRecorder: MediaRecorder;
	let audioChunks: Blob[] = [];

	let stream: MediaStream | null = null;
	let audioContext: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let dataArray: Uint8Array | null = null;
	let volume = 0;

	async function startRecording() {
		chatStore.setIsRecording(true);
		const devices = await navigator.mediaDevices.enumerateDevices();
		const realMic = devices.find((d) => d.kind === 'audioinput');

		stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				deviceId: realMic?.deviceId ? { exact: realMic.deviceId } : undefined,
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
				channelCount: 1,
				sampleRate: 48000
			}
		});

		const track = stream.getAudioTracks()[0];

		await track.applyConstraints({
			advanced: [{ echoCancellation: false }]
		});

		audioContext = new AudioContext();
		await audioContext.resume();

		const source = audioContext.createMediaStreamSource(stream);

		// Analyzer
		analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;
		dataArray = new Uint8Array(analyser.frequencyBinCount);
		source.connect(analyser);

		// Recorder
		mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
		mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
		mediaRecorder.onstop = async () => {
			if (audioChunks.length === 0) return;

			const blob = new Blob(audioChunks, { type: 'audio/webm' });
			audioChunks = [];

			stream?.getTracks().forEach((t) => t.stop());

			let file = new File([blob], 'recording.webm', { type: 'audio/webm' });

			chatStore.setIsTranscribing(true);

			try {
				const transcription = await chatStore.sendVoiceNote(file);

				if (transcription) {
					const userMessage: Message = {
						id: new Date().getTime(),
						role: 'USER',
						content: transcription,
						createdAt: new Date().toISOString()
					};
					chatStore.setMessages([...$messages, userMessage]);

					const response = await chatStore.sendMessage({
						message: transcription,
						createNewConversation: !conversationId,
						conversationId: conversationId
					});
					if (!conversationId && response?.id) {
						goto(`/chat/${response.id}`);
					}
				}
			} catch (error) {
				console.error('Error sending voice note:', error);
			} finally {
				chatStore.setIsTranscribing(false);
			}
		};

		mediaRecorder.start();
		tick();
	}

	export function stopRecording() {
		if (mediaRecorder) {
			mediaRecorder.stop();
		}
		chatStore.setIsRecording(false);
	}

	export function cancelRecording() {
		if (mediaRecorder && mediaRecorder.state === 'recording') {
			// Detach the onstop handler to prevent processing
			mediaRecorder.onstop = null;
			mediaRecorder.stop();
		}
		audioChunks = [];
		// Stop analyser + audio context
		audioContext?.close();
		if (stream) {
			stream.getTracks().forEach((t) => t.stop());
		}

		chatStore.setIsRecording(false);
	}

	function tick() {
		if (!analyser || !dataArray) return;

		analyser.getByteTimeDomainData(dataArray as any);
		let sumSquares = 0;
		for (let i = 0; i < dataArray.length; i++) {
			const normalized = (dataArray[i] - 128) / 128;
			sumSquares += normalized * normalized;
		}
		volume = Math.min(Math.sqrt(sumSquares / dataArray.length) * 10, 1);

		if ($isRecording) requestAnimationFrame(tick);
	}
</script>

<div class="flex items-center gap-3">
	<div
		class={`bg-[#EEF6FB] rounded-full transition-all duration-100 ease-linear`}
		style="padding: {volume * 20}px;"
	>
		<button
			class={cn(
				`p-2 h-[48px] bg-white hover:bg-gray-100 flex items-center justify-center w-[48px] border rounded-full`,
				{
					'bg-gradient': $isRecording
				}
			)}
			onclick={startRecording}
			disabled={$isRecording || $isTranscribing}
		>
			{#if $isTranscribing}
				<Spinner color="black" />
			{:else}
				<Mic color={$isRecording ? 'white' : 'black'} />
			{/if}
		</button>
	</div>
</div>
