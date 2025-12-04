<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import X from '@lucide/svelte/icons/x';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import noChat from '$lib/assets/icons/empty-state.png';
	import { chats, chatStore } from '$lib/stores/chatStore';
	import type { Conversation } from '$lib/types/chat';
	import ReuseableDrawer from '../../Common/ReuseableDrawer.svelte';

	let {
		isOpen = $bindable(false),
		onClose = (value: boolean) => ({})
	}: { isOpen: boolean; onClose: (value: boolean) => {} } = $props();

	function groupChats(chatsList: Conversation[]) {
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);

		const isSameDay = (d1: Date, d2: Date) =>
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate();

		const groups: { today: Conversation[]; yesterday: Conversation[]; recent: Conversation[] } = {
			today: [],
			yesterday: [],
			recent: []
		};

		for (const chat of chatsList) {
			const date = new Date(chat.updatedAt);
			if (isSameDay(date, today)) {
				groups.today.push(chat);
			} else if (isSameDay(date, yesterday)) {
				groups.yesterday.push(chat);
			} else {
				groups.recent.push(chat);
			}
		}

		return groups;
	}

	const grouped = $derived(groupChats($chats));

	async function handleDeleteSingleConversation(conversationId: string) {
		await chatStore.deleteSingleConversation(conversationId);
	}
</script>

<ReuseableDrawer bind:isOpen {onClose}>
	<div>
		<div class="border-b border-[#A3AED0] flex items-center justify-between px-5 py-8">
			<h1 class="text-[#262424] text-[20px] font-medium">Chat History</h1>
			<button
				class="bg-[#F9F9F9] size-[37px] flex items-center justify-center rounded-full cursor-pointer"
				onclick={() => (isOpen = false)}
			>
				<X color="#5F5F5F" />
			</button>
		</div>
		<div class="px-5 py-5 h-[90vh] overflow-auto">
			{#if $chats.length > 0}
				<div class="space-y-4">
					{#if grouped.today.length > 0}
						<p class="text-[16px] font-medium text-[#808990]">Today</p>
						{#each grouped.today as chat}
							<a
								href={`/${chat.id}`}
								class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-medium"
								onclick={() => (isOpen = false)}
							>
								<p>{chat.title}</p>
							</a>

							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Ellipsis class="rotate-90" size={18} color="black" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Group>
										<DropdownMenu.Label
											class="text-red-500"
											onclick={() => {
												handleDeleteSingleConversation(chat.id.toString());
											}}
											>Delete
										</DropdownMenu.Label>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{/each}
					{/if}

					{#if grouped.yesterday.length > 0}
						<p class="text-[16px] font-medium text-[#808990]">Yesterday</p>
						{#each grouped.yesterday as chat}
							<a
								href={`/${chat.id}`}
								class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-medium"
								onclick={() => (isOpen = false)}
							>
								<p>{chat.title}</p>

								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<Ellipsis class="rotate-90" size={18} color="black" />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Group>
											<DropdownMenu.Label class="text-red-500">Delete</DropdownMenu.Label>
										</DropdownMenu.Group>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</a>
						{/each}
					{/if}

					{#if grouped.recent.length > 0}
						<p class="text-[16px] font-medium text-[#808990] mt-6">Recent</p>
						{#each grouped.recent as chat}
							<div
								class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-medium"
							>
								<a href={`/${chat.id}`} onclick={() => (isOpen = false)}>
									<p>{chat.title}</p>
								</a>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<Ellipsis class="rotate-90" size={18} color="black" />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Group>
											<DropdownMenu.Label
												class="text-red-500 cursor-pointer"
												onclick={() => {
													handleDeleteSingleConversation(chat.id.toString());
												}}>Delete</DropdownMenu.Label
											>
										</DropdownMenu.Group>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						{/each}
					{/if}
				</div>
			{:else}
				<div class="flex flex-col items-center">
					<img src={noChat} alt="" width="80" height="80" />
					<p class="text-sm font-semibold text-[#80899A]">No Chat history</p>
				</div>
			{/if}
		</div>
		<div class="fixed bottom-0 w-full flex justify-end gap-5 py-3 bg-white">
			<Button
				class="p-px rounded-xl h-[50px] w-[200px] bg-gradient"
				onclick={() => (isOpen = false)}
			>
				<div class="bg-white flex items-center justify-center w-full h-[47px] rounded-xl">
					<p class="bg-gradient text-transparent bg-clip-text">Go back</p>
				</div>
			</Button>
			<Button class="bg-gradient rounded-xl border border-[#FFFFFF] h-[50px] w-[200px]"
				>Clear all chat</Button
			>
		</div>
	</div>
</ReuseableDrawer>
