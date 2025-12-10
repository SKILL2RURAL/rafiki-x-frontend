<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Messaging from '../../../components/main/Chat/Messaging.svelte';
	import { chatStore, initialMessage } from '$lib/stores/chatStore';
	import { page } from '$app/state';
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import { auth } from '$lib/stores/authStore';

	$effect(() => {
		const authUnsub = auth.subscribe(($auth) => {
			if (!$auth.accessToken) {
				goto('/guest');
			}
		});
		const id = Number(page.params.chatId);
		(async () => {
			try {
				const ok = await chatStore.getSingleConversation(id);
				if (!ok) goto('/');
			} catch (e) {
				goto('/');
			}
		})();

		const unsubscribe = initialMessage.subscribe((message) => {
			if (message) {
				chatStore.sendMessage({
					message,
					conversationId: id
				});
				chatStore.setInitialMessage(null);
			}
		});

		return () => {
			chatStore.setMessages([]);
			unsubscribe();
			authUnsub();
		};
	});
</script>

<Layout>
	<Messaging />
</Layout>
