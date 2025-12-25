<script lang="ts">
	import { goto } from '$app/navigation';

	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import X from '$lib/assets/icons/custom-x.svg';
	import logo from '$lib/assets/logo.svg';
	import { ChevronRight } from 'lucide-svelte';
	import premium from '$lib/assets/icons/premium.png';
	import noProfile from '$lib/assets/icons/no-profile.png';
	import logout from '$lib/assets/icons/door-open.png';
	import { onMount } from 'svelte';
	import { chats, chatStore, isLoadingChats } from '$lib/stores/chatStore';
	import noChat from '$lib/assets/icons/empty-state.png';
	import { auth, logout as authLogout } from '$lib/stores/authStore';
	import ChatHistorySkeleton from './ChatHistorySkeleton.svelte';
	import LogoutConfirmationModal from './LogoutConfirmationModal.svelte';

	let {
		isOpen,
		onClose,
		onOpenCreateAccount
	}: { isOpen: boolean; onClose: (v: boolean) => void; onOpenCreateAccount?: () => void } =
		$props();

	// Local state for logout confirmation modal
	let isLogoutModalOpen = $state(false);

	onMount(() => {
		chatStore.getConversations({});
	});

	function routeToChat(chatId: number) {
		goto(`/${chatId}`);
		chatStore.getSingleConversation(chatId).then((success) => {
			if (success) {
				onClose(false);
			}
		});
	}
</script>

<Drawer.Root open={isOpen} onOpenChange={onClose} direction="left">
	<Drawer.Content class="data-[vaul-drawer-direction=left]:w-screen">
		<aside class="p-5 py-10 flex flex-col justify-between h-screen">
			<div class="flex justify-between items-end">
				<div class="flex items-end gap-3 leading-none">
					<img src={logo} alt="Rafiki X" width="40" height="40" />
					<p
						class="text-[24px] font-semibold bg-linear-to-r from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
					>
						RafikiX
					</p>
				</div>
				<button class="bg-[#1E1E1E33] p-2 rounded-[8px]" onclick={() => onClose(false)}>
					<img src={X} alt="" width="20" height="20" />
				</button>
			</div>

			<!-- History  -->
			<!-- <div class="h-full mr-3 my-2 p-2 mt-5">
				<div class="space-y-3">
					<h1 class="text-[14px] font-[400] text-[#808990]">Today</h1>
					<div class="flex items-center justify-between">
						<p class="text-[16px] text-[#253B4B] font-[500]">Career story generation</p>
						<button>
							<EllipsisVertical />
						</button>
					</div>
				</div>
			</div> -->

			{#if $auth.accessToken}
				<div>
					{#if $isLoadingChats}
						<ChatHistorySkeleton />
					{:else if chats && $chats.length > 0}
						<div class="space-y-3 overflow-y-auto no-scrollbar h-[50vh]">
							{#each $chats as chat}
								<button
									class={`flex justify-between items-center cursor-pointer w-full gap-5`}
									onclick={() => routeToChat(chat.id)}
								>
									<p class="text-[#253B4B] text-[16px] text-left line-clamp-1">{chat.title}</p>
									<ChevronRight color="#80899A" />
								</button>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center">
							<img src={noChat} alt="" width="80" height="80" />
							<p class="text-sm font-semibold text-[#80899A]">No Chat history</p>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Settings  -->
			<div class="mr-3">
				<button
					class="w-full flex items-center justify-between border custom-border-gradient rounded-[10px] py-4 px-3 mb-5"
					onclick={() => goto('/learn-more')}
				>
					<p
						class="text-[16px] font-bold bg-linear-to-r from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
					>
						Learn more
					</p>
					<div class="rounded-full bg-gradient p-1">
						<ChevronRight color="white" size={15} />
					</div>
				</button>

				<h5 class="text-[#253B4B] text-[12px] mb-5 font-medium">Settings</h5>

				<div class="space-y-7 font-semibold text-[#80899A] text-sm">
					<button
						class="flex items-center gap-3"
						onclick={() => {
							goto('/subscription');
							onClose(false);
						}}
					>
						<img src={premium} alt="Rafiki X" width="20" height="20" />
						<p class="">Go premium today</p>
					</button>
					{#if $auth.accessToken}
						<button class="flex items-center gap-3" onclick={() => goto('/my-profile')}>
							<img src={noProfile} alt="Rafiki X" width="20" height="20" />
							<p>My profile</p>
						</button>
						<button
							class="flex items-center gap-3"
							onclick={() => {
								isLogoutModalOpen = true;
								onClose(false);
							}}
						>
							<img src={logout} alt="Rafiki X" width="20" height="20" />
							<p>Logout</p>
						</button>
					{/if}
				</div>
			</div>
		</aside>
	</Drawer.Content>
</Drawer.Root>

<LogoutConfirmationModal
	isOpen={isLogoutModalOpen}
	onClose={() => (isLogoutModalOpen = false)}
	onConfirm={() => {
		authLogout();
		isLogoutModalOpen = false;
	}}
/>
