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
	import pdfGrey from '$lib/assets/icons/pdf-grey.png';
	import pdfLight from '$lib/assets/icons/pdf-white.svg';
	import logout from '$lib/assets/icons/door-open.png';
	import { ChevronRight, Ellipsis, MessageCircle } from 'lucide-svelte';
	import noChat from '$lib/assets/icons/empty-state.png';
	import { history } from '$lib';
	import greaterArrow from '$lib/assets/icons/greaterArrow.png';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { chats, chatStore } from '$lib/stores/chatStore';
	import { profile } from '$lib/stores/profile';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import ReuseableDrawer from '../Common/ReuseableDrawer.svelte';
	import X from '@lucide/svelte/icons/x';
	import type { Conversation } from '$lib/types/chat';

	const todayHistory = history.find((item) => item.day === 'TODAY');

	// LOACAL STATES
	let isDrawerOpen = $state(false);
	// let grouped: {
	// 	today: Conversation[];
	// 	yesterday: Conversation[];
	// 	recent: Conversation[];
	// } = { today: [], yesterday: [], recent: [] };

	onMount(() => {
		chatStore.getConversations({});
	});

	let isSidebarOpen = $state<boolean>(
		browser ? localStorage.getItem('isSidebarOpen') === 'true' : false
	);

	function toogleSidebar() {
		isSidebarOpen = !isSidebarOpen;
		if (browser) {
			localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
		}
	}

	function groupChats(chats: Conversation[]) {
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);

		// Helper to check date
		const isSameDay = (d1: Date, d2: Date) =>
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate();

		const groups: {
			today: Conversation[];
			yesterday: Conversation[];
			recent: Conversation[];
		} = {
			today: [],
			yesterday: [],
			recent: []
		};

		for (const chat of chats) {
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
</script>

<aside
	class={`${isSidebarOpen ? 'w-(--sidebar-full-width)' : 'w-(--sidebar-collapsed-width)'} transition-all duration-200 bg-[#fcfcfc]  p-5 py-7 max-h-screen font-mulish relative hidden lg:block`}
>
	<!-- toogle button  -->
	<button
		class="absolute -right-4 top-7 bg-gradient rounded-full cursor-pointer p-1 z-40"
		onclick={toogleSidebar}
	>
		<ChevronRight color="white" size={25} class={`${!isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
	</button>
	<div class="h-full flex flex-col">
		<!-- Settings -->
		<div class="min-h-0 overflow-auto no-scrollbar">
			<!-- Logo  -->
			<img src={logo} alt="Rafiki X" width="45" height="45" />

			<!-- Links  -->
			<div class="my-5 space-y-3 mt-10">
				<button
					class={`text-[14px] font-normal p-2 rounded-[8px] cursor-pointer flex items-center gap-2 ${!isSidebarOpen ? 'justify-center' : ''} ${pathname === '/' ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
					onclick={() => goto('/')}
				>
					<MessageCircle size={17} color={pathname === '/' ? 'white' : '#808990'} />
					{#if isSidebarOpen}
						<p>Chat</p>
					{/if}
				</button>
				<button
					class={` text-[14px] font-normal p-2 rounded-[8px] cursor-pointer flex items-center gap-2 ${!isSidebarOpen ? 'justify-center' : ''} ${pathname.includes('my-resume') ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
					onclick={() => goto('/my-resume')}
				>
					{#if pathname.includes('my-resume')}
						<img src={pdfLight} alt="" width="20" height="20" />
					{:else}
						<img src={pdfGrey} alt="" width="20" height="20" />
					{/if}
					{#if isSidebarOpen}
						<p>My Resume</p>
					{/if}
				</button>
				<button
					onclick={() => goto('/career-guide')}
					class={` text-[14px] font-normal p-2 rounded-[8px] cursor-pointer flex items-center gap-2 ${!isSidebarOpen ? 'justify-center' : ''} ${pathname.includes('career-guide') ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
				>
					{#if pathname.includes('/career-guide')}
						<img src={briefcaseLight} alt="" width="20" height="20" />
					{:else}
						<img src={briefcaseGrey} alt="" width="20" height="20" />
					{/if}
					{#if isSidebarOpen}
						<p>Career Guide</p>
					{/if}
				</button>
			</div>
			<!-- Links end  -->

			<!-- Chat history  -->
			<div class="flex-col mt-10">
				{#if isSidebarOpen}
					<div>
						{#if $chats && $chats.length > 0}
							<div class="space-y-3 overflow-y-auto no-scrollbar">
								<p class="mb-4 font-[500] text-[12px] text-[#909090] uppercase">Today</p>

								{#each $chats.slice(0, 3) as chat}
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
								<button
									class="flex items-center justify-between w-full gap-3 mt-5"
									onclick={() => (isDrawerOpen = true)}
								>
									<p class="text-sm font-[400] text-[#80899A]">View All Chat history</p>
									<img src={greaterArrow} alt="direction icon" width="7" height="13" />
								</button>
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

		<div class=" relativ white mt-auto h-[250px] pt-5">
			<button
				class={`w-full flex items-center justify-between rounded-[10px] py-3 px-2 mb-10 ${isSidebarOpen ? 'border' : ''}`}
				onclick={() => goto('/learn-more')}
			>
				{#if isSidebarOpen}
					<p class="text-[16px]">Learn more</p>
					<div class="rounded-full bg-gradient p-1">
						<ChevronRight color="white" size={15} />
					</div>
				{/if}
			</button>

			{#if isSidebarOpen}
				<h5 class="text-[#253B4B] text-[12px] mb-5 font-medium uppercase">Settings</h5>
			{/if}

			<div
				class="space-y-7 mx-auto flex flex-col ${!isSidebarOpen
					? 'items-center'
					: ''}   font-semibold text-[#80899A] text-sm"
			>
				<button class={`flex items-center gap-3`}>
					<img src={premium} alt="Rafiki X" width="20" height="20" />
					{#if isSidebarOpen}
						<p>Go premium</p>
					{/if}
				</button>
				<button class={` flex items-center gap-3`} onclick={() => goto('/my-profile')}>
					{#if $profile.data?.profilePhoto}
						<Avatar.Root class="size-[20px]">
							<Avatar.Image src={$profile.data?.profilePhoto} alt="profile" />
							<Avatar.Fallback
								>{$profile.data?.firstName?.[0] + $profile.data?.lastName?.[0]}</Avatar.Fallback
							>
						</Avatar.Root>
					{:else}
						<img src={noProfile} alt="Rafiki X" class="size-[20px]" />
					{/if}

					{#if isSidebarOpen}
						<p>My profile</p>
					{/if}
				</button>
				<button
					class={`flex items-center gap-3`}
					onclick={() => {
						localStorage.removeItem('accessToken');
						goto('/login');
					}}
				>
					<img src={logout} alt="Rafiki X" width="20" height="20" />
					{#if isSidebarOpen}
						<p>Logout</p>
					{/if}
				</button>
			</div>
		</div>
	</div>
</aside>

<ReuseableDrawer bind:isOpen={isDrawerOpen} onClose={(value) => (isDrawerOpen = value)}>
	<div>
		<div class="border-b border-[#A3AED0] flex items-center justify-between px-5 py-8">
			<h1 class="text-[#262424] text-[20px] font-[500]">Chat History</h1>
			<button
				class="bg-[#F9F9F9] size-[37px] flex items-center justify-center rounded-full cursor-pointer"
				onclick={() => (isDrawerOpen = false)}
			>
				<X color="#5F5F5F" />
			</button>
		</div>
		<div class="px-5 py-8">
			{#if $chats.length > 0}
				<div class="space-y-4">
					<!-- TODAY -->
					{#if grouped.today.length > 0}
						<p class="text-[16px] font-[500] text-[#808990] mt-6">Today</p>
						{#each grouped.today as chat}
							<a
								href={`/${chat.id}`}
								class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-[500]"
								onclick={() => (isDrawerOpen = false)}
							>
								<p>{chat.title}</p>
								<Ellipsis class="rotate-90" size={18} color="black" />
							</a>
						{/each}
					{/if}

					<!-- YESTERDAY -->
					{#if grouped.yesterday.length > 0}
						<p class="text-[16px] font-[500] text-[#808990] mt-6">Yesterday</p>
						{#each grouped.yesterday as chat}
							<a
								href={`/${chat.id}`}
								class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-[500]"
								onclick={() => (isDrawerOpen = false)}
							>
								<p>{chat.title}</p>
								<Ellipsis class="rotate-90" size={18} color="black" />
							</a>
						{/each}
					{/if}

					<!-- RECENT -->
					{#if grouped.recent.length > 0}
						<p class="text-[16px] font-[500] text-[#808990] mt-6">Recent</p>
						{#each grouped.recent as chat}
							<a
								href={`/${chat.id}`}
								class="flex items-center justify-between w-full text-[#253B4B] text-[16px] font-[500]"
								onclick={() => (isDrawerOpen = false)}
							>
								<p>{chat.title}</p>
								<Ellipsis class="rotate-90" size={18} color="black" />
							</a>
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
	</div>
</ReuseableDrawer>
