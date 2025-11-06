<script>
	import { onMount } from 'svelte';
	import Messaging from '../../../components/Chat/Messaging.svelte';
	import Layout from '../../../components/Layout/Layout.svelte';
	import { chatStore } from '$lib/stores/chatStore';
	import { page } from '$app/state';

	onMount(() => {
		chatStore.getSingleConversation(Number(page.params.chatId));
	});
</script>

<Layout>
	<div class="">
		<Messaging />
	</div>
</Layout>
