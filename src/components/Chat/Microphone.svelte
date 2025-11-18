<script lang="ts">
	import { Mic } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';

	let recognition: any;
	let transcript = '';
	let isListening = false;

	$: {
		if (transcript) {
			console.log('Transcript ->', transcript);
		}
	}

	function startListening() {
		const SpeechRecognition =
			(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

		if (!SpeechRecognition) {
			toast.error('Speech Recognition is not supported in this browser');
			return;
		}

		recognition = new SpeechRecognition();
		recognition.lang = 'en-US'; // language
		recognition.interimResults = true; // show partial results
		recognition.continuous = true;

		recognition.onstart = () => {
			console.log('Recognition started');
		};

		recognition.onspeechstart = () => {
			console.log('Speech detected');
		};

		recognition.onspeechend = () => {
			console.log('Speech ended');
		};

		recognition.onerror = (event: any) => {
			console.error('Recognition error:', event.error);
		};

		recognition.onresult = (event: any) => {
			transcript = Array.from(event.results)
				.map((result: any) => result[0].transcript)
				.join('');
		};

		recognition.onend = () => {
			if (isListening) recognition.start();
		};

		recognition.start();
		isListening = true;
	}

	function stopListening() {
		if (recognition) {
			recognition.stop();
			isListening = false;
		}
	}

	// Cleanup when component unmounts
	onDestroy(() => {
		if (recognition) recognition.stop();
	});
</script>

<button
	class={`${isListening ? 'bg-red-500' : 'bg-gray-100'} p-2 h-[48px] flex items-center justify-center w-[48px] border rounded-full hover:bg-gry-100`}
>
	<Mic />
</button>
