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
	import { ChevronRight, MessageCircle } from 'lucide-svelte';
	import noChat from '$lib/assets/icons/empty-state.png';
	import { history } from '$lib';
	import greaterArrow from '$lib/assets/icons/greaterArrow.png';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { chats, chatStore } from '$lib/stores/chatStore';
	import { profile } from '$lib/stores/profile';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import ChatHistoryDrawer from './ChatHistoryDrawer.svelte';
	import type { Conversation } from '$lib/types/chat';

	let { onOpenCreateAccount }: { onOpenCreateAccount?: () => void } = $props();

	const todayHistory = history.find((item) => item.day === 'TODAY');

	// LOACAL STATES
	let isDrawerOpen = $state(false);

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

	function groupChatsLimited(chatsList: Conversation[], limit: number) {
		const g = groupChats(chatsList);
		let remaining = limit;
		const take = (arr: Conversation[]) => {
			const n = Math.min(arr.length, remaining);
			const res = arr.slice(0, n);
			remaining -= n;
			return res;
		};
		return {
			today: take(g.today),
			yesterday: remaining > 0 ? take(g.yesterday) : [],
			recent: remaining > 0 ? take(g.recent) : []
		};
	}

	const groupedLimited = $derived(groupChatsLimited($chats, 3));
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
				<a
					href="/"
					class={`text-[14px] font-normal p-2 rounded-[8px] cursor-pointer flex items-center gap-2 ${!isSidebarOpen ? 'justify-center' : ''} ${pathname === '/' ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
				>
					<MessageCircle size={17} color={pathname === '/' ? 'white' : '#808990'} />
					{#if isSidebarOpen}
						<p>Chat</p>
					{/if}
				</a>
				<a
					href="/my-resume"
					class={` text-[14px] font-normal p-2 rounded-[8px] cursor-pointer flex items-center gap-2 ${!isSidebarOpen ? 'justify-center' : ''} ${pathname.includes('my-resume') ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
				>
					{#if pathname.includes('my-resume')}
						<img src={pdfLight} alt="" width="20" height="20" />
					{:else}
						<img src={pdfGrey} alt="" width="20" height="20" />
					{/if}
					{#if isSidebarOpen}
						<p>My Resume</p>
					{/if}
				</a>
				<a
					href="/career-guide"
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
				</a>
			</div>
			<!-- Links end  -->

			<!-- Chat history  -->
			<div class="flex-col mt-10">
				{#if isSidebarOpen}
					<div>
						{#if $chats && $chats.length > 0}
							<div class="space-y-3 overflow-y-auto no-scrollbar">
								{#if groupedLimited.today.length > 0}
									<p class="mb-4 font-medium text-[12px] text-[#909090] uppercase">Today</p>
									{#each groupedLimited.today as chat}
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

								<button
									class="flex items-center justify-between w-full gap-3 mt-5"
									onclick={() => (isDrawerOpen = true)}
								>
									<p class="text-sm font-normal text-[#80899A]">View All Chat history</p>
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

		<div class=" bg-white mt-auto h-[300px] pt-5">
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

			<div
				class="space-y-7 mx-auto flex flex-col ${!isSidebarOpen
					? 'items-center'
					: ''}   font-semibold text-[#80899A] text-sm"
			>
				<button class={`flex items-center gap-3`} onclick={() => goto('/subscription')}>
					<img src={premium} alt="Rafiki X" width="20" height="20" />
					{#if isSidebarOpen}
						<p>Go premium</p>
					{/if}
				</button>
				<a href="/my-profile" class={` flex items-center gap-3`}>
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
				</a>
				<button class={`flex items-center gap-3`} onclick={() => onOpenCreateAccount?.()}>
					{#if isSidebarOpen}
						<p>Create account</p>
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

<ChatHistoryDrawer
	bind:isOpen={isDrawerOpen}
	onClose={(value: boolean) => (isDrawerOpen = value)}
/>
