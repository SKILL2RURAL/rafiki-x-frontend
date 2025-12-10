<script>
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import Messaging from '../../../components/main/Chat/Messaging.svelte';
	import { chatStore, initialMessage } from '$lib/stores/chatStore';
	import { messages } from '$lib/stores/chatStore';
	import { goto } from '$app/navigation';

	$effect(() => {
		const unsubscribe = initialMessage.subscribe((message) => {
			if (message) {
				chatStore.setMessages([
					{
						id: new Date().getTime(),
						role: 'USER',
						content: message,
						createdAt: new Date().toISOString(),
						attachments: []
					}
				]);
				chatStore.sendGuestMessage(message);
				chatStore.setInitialMessage(null);
			}
		});
		const unsubMsgs = messages.subscribe((ms) => {
			if (!ms || ms.length === 0) {
				goto('/');
			}
		});
		return () => unsubscribe();
	});
</script>

<Layout>
	<Messaging />
</Layout>
