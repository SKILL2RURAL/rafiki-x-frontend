<script lang="ts">
	import { chatStore } from '$lib/stores/chatStore';
	import { Mic } from 'lucide-svelte';

	let isRecording = false;
	let mediaRecorder: MediaRecorder;
	let audioChunks: Blob[] = [];
	let audioUrl: string | null = null;

	let stream: MediaStream | null = null;
	let audioContext: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let dataArray: Uint8Array | null = null;
	let volume = 0;

	async function startRecording() {
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
			const blob = new Blob(audioChunks, { type: 'audio/webm' });
			audioUrl = URL.createObjectURL(blob);
			audioChunks = [];

			stream?.getTracks().forEach((t) => t.stop());

			let file = new File([blob], 'recording.webm', { type: 'audio/webm' });
			await chatStore.sendVoiceNote(file);
		};

		mediaRecorder.start();
		isRecording = true;
		tick();
	}

	function stopRecording() {
		mediaRecorder.stop();

		// Stop analyser + audio context
		audioContext?.close();

		if (stream) {
			stream.getTracks().forEach((t) => t.stop());
		}

		isRecording = false;
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

		if (isRecording) requestAnimationFrame(tick);
	}
</script>

<div class="flex items-center gap-3">
	<button
		class={`${isRecording ? 'animate-pulse repeat-infinite' : ''} p-2 h-[48px] bg-gray-100 flex items-center justify-center w-[48px] border rounded-full hover:bg-gry-100`}
		onclick={isRecording ? stopRecording : startRecording}
	>
		<Mic />
	</button>

	<!-- volume bar -->
	<!-- <div class="mt-4 h-2 bg-gray-300 w-[200px]">
		<div
			class="h-2 transition-all"
			style="
      width: {volume * 100}%;
      background-color: {volume > 0.7 ? 'red' : volume > 0.3 ? 'yellow' : 'green'};
    "
		></div>
	</div> -->
</div>
