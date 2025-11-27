<script>
	import { onMount } from 'svelte';
	import Messaging from '../../../components/Chat/Messaging.svelte';
	import Layout from '../../../components/Layout/Layout.svelte';
	import { chatStore, initialMessage } from '$lib/stores/chatStore';
	import { page } from '$app/state';

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
