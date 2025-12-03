<script>
	import { onMount } from 'svelte';
	import Messaging from '../../../components/main/Chat/Messaging.svelte';
	import { chatStore, initialMessage } from '$lib/stores/chatStore';
	import { page } from '$app/state';
	import Layout from '../../../components/main/Layout/Layout.svelte';

	$effect(() => {
		chatStore.getSingleConversation(Number(page.params.chatId));

		const unsubscribe = initialMessage.subscribe((message) => {
			if (message) {
				chatStore.sendMessage({
					message,
					conversationId: Number(page.params.chatId)
				});
				chatStore.setInitialMessage(null);
			}
		});

		return () => {
			chatStore.setMessages([]);
			unsubscribe();
		};
	});
</script>

<Layout>
	<Messaging />
</Layout>
