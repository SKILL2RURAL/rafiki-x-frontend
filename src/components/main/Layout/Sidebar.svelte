<script lang="ts">
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	const { page } = getStores();
	const pathname = $derived($page.url.pathname);

	import logo from '$lib/assets/icons/logo-gradient.png';
	import premium from '$lib/assets/icons/premium.png';
	import noProfile from '$lib/assets/icons/no-profile.png';
	import briefcaseGrey from '$lib/assets/icons/briefcase-grey.png';
	import briefcaseLight from '$lib/assets/icons/briefcase-light.png';
	import fileLight from '$lib/assets/icons/file-white.png';
	import file from '$lib/assets/icons/file.png';
	import logout from '$lib/assets/icons/door-open.png';
	import { ChevronRight, MessageCircle } from 'lucide-svelte';
	import noChat from '$lib/assets/icons/empty-state.png';
	import greaterArrow from '$lib/assets/icons/greaterArrow.png';
	import { onMount } from 'svelte';
	import { chats, chatStore, isLoadingChats } from '$lib/stores/chatStore';
	import ChatHistorySkeleton from './ChatHistorySkeleton.svelte';
	import { fetchProfile, profile } from '$lib/stores/profile';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import ChatHistoryDrawer from './ChatHistoryDrawer.svelte';
	import LogoutConfirmationModal from './LogoutConfirmationModal.svelte';
	import { auth, logout as authLogout } from '$lib/stores/authStore';
	import { groupChatsLimited } from '$lib/chatGrouping';
	import { getInitialSidebarOpen, toggleSidebarOpen } from './sidebar.utils';

	let { onOpenCreateAccount }: { onOpenCreateAccount?: () => void } = $props();

	// Local state for logout confirmation modal
	let isLogoutModalOpen = $state(false);

	// LOACAL STATES
	let isDrawerOpen = $state(false);

	onMount(() => {
		if ($auth.accessToken) {
			chatStore.getConversations({});
			fetchProfile();
		}
	});

	let isSidebarOpen = $state<boolean>(getInitialSidebarOpen());

	const groupedLimited = $derived(groupChatsLimited($chats, 3));
</script>

<aside
	class={`${isSidebarOpen ? 'w-(--sidebar-full-width)' : 'w-(--sidebar-collapsed-width)'} transition-all duration-200 bg-[#fcfcfc]  p-5 py-7 max-h-screen font-mulish relative hidden lg:block`}
>
	<!-- toogle button  -->
	<button
		class="absolute -right-4 top-7 bg-gradient rounded-full cursor-pointer p-1 z-40"
		onclick={() => (isSidebarOpen = toggleSidebarOpen(isSidebarOpen))}
	>
		<ChevronRight color="white" size={25} class={`${!isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
	</button>
	<div class="h-full flex flex-col">
		<!-- Settings -->
		<div class="min-h-0 overflow-hidden">
			<!-- Logo  -->
			<button onclick={() => goto('/')}>
				<div class="flex gap-2 items-end">
					<img src={logo} alt="Rafiki X" width="45" height="45" />
					{#if isSidebarOpen}
						<p
							class="font-mulish font-bold text-[24px] bg-linear-to-br from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
						>
							RafikiX
						</p>
					{/if}
				</div>
			</button>

			<!-- Links  -->
			<div class="my-5 space-y-3 mt-10">
				<a
					href="/"
					class={`text-[14px] font-normal p-2 rounded-xl cursor-pointer flex items-center gap-2 ${pathname === '/' ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
				>
					<MessageCircle size={17} color={pathname === '/' ? 'white' : '#808990'} />
					{#if isSidebarOpen}
						<p>Chat</p>
					{/if}
				</a>
				<a
					href="/my-resume"
					class={` text-[14px] font-normal p-2 rounded-xl cursor-pointer flex items-center gap-2 ${pathname.includes('my-resume') ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
				>
					{#if !pathname.includes('my-resume')}
						<img src={file} alt="file" width="20" height="20" />
					{:else}
						<img src={fileLight} alt="file" width="20" height="20" />
					{/if}
					{#if isSidebarOpen}
						<p>My Resume</p>
					{/if}
				</a>
				<a
					href="/career-guide"
					class={` text-[14px] font-normal p-2 rounded-xl cursor-pointer flex items-center gap-2 ${pathname.includes('career-guide') ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
				>
					{#if pathname.includes('/career-guide')}
						<img src={briefcaseLight} alt="" width="20" height="20" />
					{:else}
						<img src={briefcaseGrey} alt="" width="20" height="20" />
					{/if}
					{#if isSidebarOpen}
						<p>Career Guide</p>
					{/if}
				</a>
			</div>
			<!-- Links end  -->

			<!-- Chat history  -->
			<div class="flex-col mt-10">
				{#if isSidebarOpen && $auth.accessToken}
					<div>
						{#if $isLoadingChats && $chats.length === 0}
							<ChatHistorySkeleton />
						{:else if $chats && $chats.length > 0}
							<div class="space-y-3">
								{#if groupedLimited.today.length > 0}
									<p class="mb-4 font-medium text-[12px] text-[#909090] uppercase">Today</p>
									<div class="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
										{#each groupedLimited.today as chat}
											<button
												class={`flex justify-between items-center cursor-pointer w-full gap-5`}
												onclick={() => {
													goto(`/${chat.id}`);
													chatStore.getSingleConversation(Number(chat.id));
												}}
											>
												<p class="text-[#253B4B] text-[16px] text-left line-clamp-1">
													{chat.title}
												</p>
												<img src={greaterArrow} alt="direction icon" width="7" height="13" />
											</button>
										{/each}
									</div>
								{/if}

								{#if groupedLimited.yesterday.length > 0}
									<p class="mb-4 font-medium text-[12px] text-[#909090] uppercase">Yesterday</p>
									{#each groupedLimited.yesterday as chat}
										<button
											class={`flex justify-between items-center cursor-pointer w-full gap-5`}
											onclick={() => {
												goto(`/${chat.id}`);
												chatStore.getSingleConversation(Number(chat.id));
											}}
										>
											<p class="text-[#253B4B] text-[16px] text-left line-clamp-1">{chat.title}</p>
											<img src={greaterArrow} alt="direction icon" width="7" height="13" />
										</button>
									{/each}
								{/if}

								{#if groupedLimited.recent.length > 0}
									<p class="mb-4 font-medium text-[12px] text-[#909090] uppercase">Recent</p>
									{#each groupedLimited.recent as chat}
										<button
											class={`flex justify-between items-center cursor-pointer w-full gap-5`}
											onclick={() => {
												goto(`/${chat.id}`);
												chatStore.getSingleConversation(Number(chat.id));
											}}
										>
											<p class="text-[#253B4B] text-[16px] text-left line-clamp-1">{chat.title}</p>
											<img src={greaterArrow} alt="direction icon" width="7" height="13" />
										</button>
									{/each}
								{/if}

								{#if $chats.length > 3}
									<button
										class="flex items-center justify-between w-full gap-3 mt-5"
										onclick={() => (isDrawerOpen = true)}
									>
										<p class="text-sm font-normal text-[#80899A]">View All Chat history</p>
										<img src={greaterArrow} alt="direction icon" width="7" height="13" />
									</button>
								{/if}
							</div>
						{:else}
							<div class="flex flex-col items-center">
								<img src={noChat} alt="" width="80" height="80" />
								<p class="text-sm font-semibold text-[#80899A]">No Chat history</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div class=" flex flex-col justify-end mt-auto h-[250px] pt-5">
			<button
				class={`w-full rounded-[11px] p-px mb-10 ${isSidebarOpen ? 'bg-linear-to-br from-[#51A3DA] to-[#60269E]' : ''}`}
				onclick={() => goto('/learn-more')}
			>
				<div class="bg-white py-3 px-2 rounded-[10px]">
					<div
						class="flex items-center bg-linear-to-br from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text justify-between"
					>
						{#if isSidebarOpen}
							<p class="text-[16px]">Learn more</p>
							<div class="rounded-full bg-gradient p-1">
								<ChevronRight color="white" size={15} />
							</div>
						{/if}
					</div>
				</div>
			</button>

			{#if isSidebarOpen}
				<h5 class="text-[#253B4B] text-[12px] mb-5 font-medium uppercase">Settings</h5>
			{/if}

			<div class="space-y-7 flex flex-col font-semibold text-[#80899A] text-sm">
				<button class={`flex items-center gap-3`} onclick={() => goto('/subscription')}>
					<img src={premium} alt="Rafiki X" width="20" height="20" />
					{#if isSidebarOpen}
						<p>Go premium</p>
					{/if}
				</button>
				{#if $auth.accessToken}
					<a href="/my-profile" class={` flex items-center gap-3`}>
						{#if $profile.data?.profilePhoto}
							<Avatar.Root class="size-5">
								<Avatar.Image src={$profile.data?.profilePhoto} alt="profile" />
								<Avatar.Fallback
									>{$profile.data?.firstName?.[0] + $profile.data?.lastName?.[0]}</Avatar.Fallback
								>
							</Avatar.Root>
						{:else}
							<img src={noProfile} alt="Rafiki X" class="size-5" />
						{/if}

						{#if isSidebarOpen}
							<p>My profile</p>
						{/if}
					</a>
				{/if}

				{#if $auth.accessToken}
					{#if $auth.accessToken}
						<button
							class={`flex items-center gap-3`}
							onclick={() => {
								isLogoutModalOpen = true;
							}}
						>
							<img src={logout} alt="Rafiki X" width="20" height="20" />
							{#if isSidebarOpen}
								<p>Logout</p>
							{/if}
						</button>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</aside>

<ChatHistoryDrawer
	bind:isOpen={isDrawerOpen}
	onClose={(value: boolean) => (isDrawerOpen = value)}
/>

<LogoutConfirmationModal
	isOpen={isLogoutModalOpen}
	onClose={() => (isLogoutModalOpen = false)}
	onConfirm={() => {
		authLogout();
		isLogoutModalOpen = false;
		// Redirect if user is on my-profile page since unauthorized users can't access it
		if ($page.url.pathname === '/my-profile') {
			goto('/');
		}
	}}
/>
