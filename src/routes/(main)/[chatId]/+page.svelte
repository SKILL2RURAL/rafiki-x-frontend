<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Messaging from '../../../components/main/Chat/Messaging.svelte';
	import { chatStore, initialMessage } from '$lib/stores/chatStore';
	import { page } from '$app/state';
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import { auth } from '$lib/stores/authStore';
	import { loadConversationOrRedirect, setupChatPageEffect } from './chatPage.logic';

	$effect(() => {
		return setupChatPageEffect({
			auth,
			initialMessage,
			browser,
			goto,
			chatStore,
			chatId: Number(page.params.chatId)
		});
	});

	onMount(() => {
		const id = Number(page.params.chatId);

		void loadConversationOrRedirect({ chatId: id, chatStore, goto });

		return () => {
			chatStore.setMessages([]);
		};
	});
</script>

<Layout>
	<Messaging />
</Layout>
