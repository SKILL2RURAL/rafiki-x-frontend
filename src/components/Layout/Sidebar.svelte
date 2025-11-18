<script lang="ts">
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	const { page } = getStores();
	const pathname = $derived($page.url.pathname);

	import logo from '$lib/assets/icons/logo-gradient.png';
	import premium from '$lib/assets/icons/premium.png';
	import noProfile from '$lib/assets/icons/no-profile.png';
	import briefcaseGrey from '$lib/assets/icons/briefcase-grey.png';
	import briefcaseLight from '$lib/assets/icons/briefcase-light.svg';
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

	const todayHistory = history.find((item) => item.day === 'TODAY');

	onMount(() => {
		chatStore.getConversations({});
	});

	let isSidebarOpen = $state<boolean>(
		browser ? localStorage.getItem('isSidebarOpen') === 'true' : false
	);
	let { openHistory }: { openHistory: () => void } = $props();

	function toogleSidebar() {
		isSidebarOpen = !isSidebarOpen;
		if (browser) {
			localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
		}
	}
</script>

<aside
	class={`${isSidebarOpen ? 'w-(--sidebar-full-width)' : 'w-(--sidebar-collapsed-width)'} transition-all duration-200  p-5 py-7 h-screen border-r-[0.4px] font-mulish relative hidden lg:block`}
>
	<!-- toogle button  -->
	<button
		class="absolute -right-4 top-7 bg-gradient rounded-full cursor-pointer p-1"
		onclick={toogleSidebar}
	>
		<ChevronRight color="white" size={25} class={`${!isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
	</button>
	<div class="flex flex-col h-full justify-between">
		<div>
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
			<div class="flex-col mt-5">
				{#if isSidebarOpen}
					<div>
						{#if chats && $chats.length > 0}
							<div class="space-y-3 overflow-y-auto no-scrollbar h-[410px]">
								{#each $chats as chat, index}
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

			<!-- {#if isSidebarOpen}
				<div class="flex flex-col gap-1">
					{#if history.length === 0}
						<div class="flex flex-col justify-center items-center mt-3">
							<img src={noChat} alt="" width="80" height="80" />
							<p class="text-sm font-semibold text-[#80899A]">No Chat history</p>
						</div>
					{:else}
						<div class="flex flex-col justify-center items-center mt-3">
							<img src={noChat} alt="" width="80" height="80" />
							<button class="text-sm font-semibold text-[#80899A] flex gap-2" onclick={openHistory}
								>View All Chat history <img
									src={greaterArrow}
									alt="direction icon"
									width="7"
									height="13"
								/></button
							>
						</div>
						{#if todayHistory && todayHistory.subject.length > 0}
							<h1 class="text-[#808990] mt-1">{todayHistory.day}</h1>
							<ul>
								{#each todayHistory.subject as subject}
									<li class="flex justify-between items-center mt-1">
										<span>{subject}</span>
										<img src={greaterArrow} alt="direction icon" width="7" height="13" />
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-sm text-[#80899A] mt-4">No chats for today</p>
						{/if}
					{/if}
				</div>
			{/if} -->
			<!-- Chat history end  -->
		</div>

		<!-- Learn more  -->

		<!-- Settings  -->
		<div class="mt-3">
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
				<h5 class="text-[#253B4B] text-[12px] mb-5 font-medium">Settings</h5>
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
					<img src={noProfile} alt="Rafiki X" width="20" height="20" />
					{#if isSidebarOpen}
						<p>My profile</p>
					{/if}
				</button>
				<button
					class={`flex items-center gap-3`}
					onclick={() => {
						localStorage.delete('accessToken');
						goto('/login', { replaceState: true });
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
