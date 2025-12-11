<script lang="ts">
	import { goto } from '$app/navigation';
	import { chatStore } from '$lib/stores/chatStore';
	import { sendingMessage } from '$lib/stores/chatStore';
	import { MoveUpRight } from 'lucide-svelte';

	const { sendMessage } = chatStore;
	import { auth } from '$lib/stores/authStore';

	let {
		title,
		image,
		onRequireAuth
	}: { title: string; image: string; onRequireAuth?: () => void } = $props();

	async function handleSend(value: string) {
		if (!$auth.accessToken) {
			onRequireAuth?.();
			return;
		}
		await sendMessage({
			message: value,
			createNewConversation: true
		}).then((res) => {
			goto(`/${res.conversationId}`);
		});
	}
</script>

<button
	class="bg-[#F7FBFD] rounded-[10px] p-5 text-[#686868] min-w-[240px] lg:min-w-full lg:w-fit flex flex-col justify-between"
	disabled={$sendingMessage}
	onclick={() => {
		handleSend(title);
	}}
>
	<p class="lg:max-w-[150px] mb-10 text-left">{title}</p>
	<div class="flex items-center gap-2 justify-between">
		<img src={image} alt="" />
		<MoveUpRight color="#808990" />
	</div>
</button>
