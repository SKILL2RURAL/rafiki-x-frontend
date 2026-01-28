<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import X from '@lucide/svelte/icons/x';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import noChat from '$lib/assets/icons/empty-state.png';
	import { chats, chatStore, isLoadingChats } from '$lib/stores/chatStore';
	import ReuseableDrawer from '../../Common/ReuseableDrawer.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import ChatHistorySkeleton from './ChatHistorySkeleton.svelte';
	import { groupChats } from '$lib/chatGrouping';
	import { deleteSingleConversation, openDeleteConfirm } from './chatHistoryDrawer.utils';

	let {
		isOpen = $bindable(false),
		onClose = (value: boolean) => ({})
	}: { isOpen: boolean; onClose: (value: boolean) => {} } = $props();

	const grouped = $derived(groupChats($chats));

	let isAlertOpen = $state(false);
	let deletingId = $state<number | null>(null);
	let openMenuId = $state<number | null>(null);
	let isClearAllOpen = $state(false);
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
		<div class="px-5 py-5 h-[90vh] flex flex-col min-h-0">
			{#if $isLoadingChats}
				<ChatHistorySkeleton />
			{:else if $chats.length > 0}
				<div class="flex flex-col gap-4 min-h-0">
					{#if grouped.today.length > 0}
						<div class="flex flex-col gap-3 min-h-0 flex-1">
							<p class="text-[16px] font-medium text-[#808990]">Today</p>
							<div class="space-y-4 overflow-auto no-scrollbar min-h-0 pr-1">
								{#each grouped.today as chat}
									<div
										class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-medium"
									>
										<a
											href={`/${chat.id}`}
											class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-medium"
											onclick={() => (isOpen = false)}
										>
											<p>{chat.title}</p>
										</a>

										<DropdownMenu.Root
											open={openMenuId === chat.id}
											onOpenChange={(v) => (openMenuId = v ? chat.id : null)}
										>
											<DropdownMenu.Trigger>
												<Ellipsis class="rotate-90" size={18} color="black" />
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Group>
													<DropdownMenu.Label
														class="text-red-500"
														onclick={() =>
															openDeleteConfirm(
																chat.id,
																(v) => (deletingId = v),
																(v) => (isAlertOpen = v),
																(v) => (openMenuId = v)
															)}
														>Delete
													</DropdownMenu.Label>
												</DropdownMenu.Group>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					{#if grouped.yesterday.length > 0}
						<p class="text-[16px] font-medium text-[#808990]">Yesterday</p>
						{#each grouped.yesterday as chat}
							<div
								class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-medium"
							>
								<a
									href={`/${chat.id}`}
									class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-medium"
									onclick={() => (isOpen = false)}
								>
									<p>{chat.title}</p>
								</a>

								<DropdownMenu.Root
									open={openMenuId === chat.id}
									onOpenChange={(v) => (openMenuId = v ? chat.id : null)}
								>
									<DropdownMenu.Trigger>
										<Ellipsis class="rotate-90" size={18} color="black" />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Group>
											<DropdownMenu.Label
												class="text-red-500"
												onclick={() =>
													openDeleteConfirm(
														chat.id,
														(v) => (deletingId = v),
														(v) => (isAlertOpen = v),
														(v) => (openMenuId = v)
													)}>Delete</DropdownMenu.Label
											>
										</DropdownMenu.Group>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
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
								<DropdownMenu.Root
									open={openMenuId === chat.id}
									onOpenChange={(v) => (openMenuId = v ? chat.id : null)}
								>
									<DropdownMenu.Trigger>
										<Ellipsis class="rotate-90" size={18} color="black" />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Group>
											<DropdownMenu.Label
												class="text-red-500 cursor-pointer"
												onclick={() =>
													openDeleteConfirm(
														chat.id,
														(v) => (deletingId = v),
														(v) => (isAlertOpen = v),
														(v) => (openMenuId = v)
													)}>Delete</DropdownMenu.Label
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
			<Button
				class="bg-gradient rounded-xl border border-[#FFFFFF] h-[50px] w-[200px]"
				onclick={() => (isClearAllOpen = true)}>Clear all chat</Button
			>
		</div>
	</div>
</ReuseableDrawer>

<AlertDialog.Root
	open={isAlertOpen}
	onOpenChange={(v) => {
		isAlertOpen = v;
		if (!v) deletingId = null;
	}}
>
	<AlertDialog.Overlay />
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Conversation</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. Are you sure you want to delete this conversation?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				onclick={() => {
					isAlertOpen = false;
					deletingId = null;
				}}>Cancel</AlertDialog.Cancel
			>
			<AlertDialog.Action
				class="bg-red-500 hover:bg-red-500/70"
				onclick={async () => {
					if (deletingId !== null) {
						await deleteSingleConversation(chatStore, deletingId);
					}
					isAlertOpen = false;
					deletingId = null;
					openMenuId = null;
				}}>Delete</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root open={isClearAllOpen} onOpenChange={(v) => (isClearAllOpen = v)}>
	<AlertDialog.Overlay />
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Clear all conversations</AlertDialog.Title>
			<AlertDialog.Description>
				This will permanently delete all your conversations. Do you want to continue?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={() => (isClearAllOpen = false)}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="bg-red-500 hover:bg-red-500/70"
				onclick={async () => {
					await chatStore.deleteAllConversations();
					isClearAllOpen = false;
					openMenuId = null;
				}}>Delete All</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
