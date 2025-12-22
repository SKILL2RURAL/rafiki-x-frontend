<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Messaging from '../../../components/main/Chat/Messaging.svelte';
	import { chatStore, initialMessage } from '$lib/stores/chatStore';
	import { page } from '$app/state';
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import { auth } from '$lib/stores/authStore';

	$effect(() => {
		const authUnsub = auth.subscribe(($auth) => {
			if (browser && !$auth.accessToken) {
				goto('/guest');
			}
		});

		const unsubscribe = initialMessage.subscribe((message) => {
			if (message) {
				const id = Number(page.params.chatId);
				chatStore.sendMessage({
					message,
					conversationId: id
				});
				chatStore.setInitialMessage(null);
			}
		});

		return () => {
			unsubscribe();
			authUnsub();
		};
	});

	onMount(() => {
		const id = Number(page.params.chatId);

		(async () => {
			try {
				const ok = await chatStore.getSingleConversation(id);
				if (!ok) goto('/');
			} catch (e) {
				goto('/');
			}
		})();

		return () => {
			chatStore.setMessages([]);
		};
	});
</script>

<Layout>
	<Messaging />
</Layout>
