type ChatStore = {
	setIsRecording: (v: boolean) => void;
	setIsTranscribing: (v: boolean) => void;
	sendVoiceNote: (file: File) => Promise<string | null>;
	setNewMessage: (message: string) => void;
};

export function createMicrophoneRecorder(options: {
	chatStore: ChatStore;
	getNewMessage: () => string;
	getIsRecording: () => boolean;
	setVolume: (v: number) => void;
}) {
	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = [];
	let stream: MediaStream | null = null;
	let audioContext: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let dataArray: Uint8Array | null = null;
	let rafId: number | null = null;

	function startMeter() {
		if (!analyser || !dataArray) return;

		const tick = () => {
			if (!analyser || !dataArray) return;

			analyser.getByteTimeDomainData(dataArray as unknown as Uint8Array<ArrayBuffer>);
			let sumSquares = 0;
			for (let i = 0; i < dataArray.length; i++) {
				const normalized = (dataArray[i] - 128) / 128;
				sumSquares += normalized * normalized;
			}
			const volume = Math.min(Math.sqrt(sumSquares / dataArray.length) * 10, 1);
			options.setVolume(volume);

			if (options.getIsRecording()) {
				rafId = requestAnimationFrame(tick);
			} else {
				rafId = null;
				options.setVolume(0);
			}
		};

		rafId = requestAnimationFrame(tick);
	}

	async function start() {
		options.chatStore.setIsRecording(true);

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

		analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;
		dataArray = new Uint8Array(analyser.frequencyBinCount);
		source.connect(analyser);

		mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
		mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
		mediaRecorder.onstop = async () => {
			if (audioChunks.length === 0) return;

			const blob = new Blob(audioChunks, { type: 'audio/webm' });
			audioChunks = [];

			stream?.getTracks().forEach((t) => t.stop());

			const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

			options.chatStore.setIsTranscribing(true);
			try {
				const transcription = await options.chatStore.sendVoiceNote(file);
				if (transcription) {
					options.chatStore.setNewMessage(`${options.getNewMessage()} ${transcription}`);
				}
			} catch (error) {
				console.error('Error sending voice note:', error);
			} finally {
				options.chatStore.setIsTranscribing(false);
			}
		};

		mediaRecorder.start();
		startMeter();
	}

	function stop() {
		if (mediaRecorder) {
			mediaRecorder.stop();
		}
		options.chatStore.setIsRecording(false);
	}

	function cancel() {
		if (mediaRecorder && mediaRecorder.state === 'recording') {
			mediaRecorder.onstop = null;
			mediaRecorder.stop();
		}

		audioChunks = [];

		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}

		audioContext?.close();
		if (stream) {
			stream.getTracks().forEach((t) => t.stop());
		}

		options.setVolume(0);
		options.chatStore.setIsRecording(false);
	}

	return { start, stop, cancel };
}
