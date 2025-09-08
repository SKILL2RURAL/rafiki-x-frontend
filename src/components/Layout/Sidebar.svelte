<script lang="ts">
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	const { page } = getStores();
	$: pathname = $page.url.pathname;

	import logo from '$lib/assets/icons/logo-gradient.png';
	import premium from '$lib/assets/icons/premium.png';
	import noProfile from '$lib/assets/icons/no-profile.png';
	import briefcaseGrey from '$lib/assets/icons/briefcase-grey.png';
	import pdfGrey from '$lib/assets/icons/pdf-grey.png';
	import logout from '$lib/assets/icons/door-open.png';
	import { ChevronRight, MessageCircle } from 'lucide-svelte';
	import noChat from '$lib/assets/icons/empty state.png';
</script>

<aside
	class="w-[var(--sidebar-width)] p-5 py-7 h-screen border-r-[0.4px] border-[#C8CCD0] font-mulish relative"
>
	<div class="absolute -right-4 top-10 bg-gradient rounded-full cursor-pointer p-1">
		<ChevronRight color="white" size={25} />
	</div>
	<div class="flex flex-col h-full justify-between">
		<div>
			<img src={logo} alt="Rafiki X" width="45" height="45" />

			<div class="my-5 space-y-3 mt-10">
				<button
					class={`text-[14px] font-normal p-2 rounded-[8px] cursor-pointer flex items-center gap-2 ${pathname === '/' ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
					on:click={() => goto('/')}
				>
					<MessageCircle size={17} color={pathname === '/' ? 'white' : '#808990'} />
					Chat
				</button>
				<button
					class={` text-[14px] font-normal p-2 rounded-[8px] cursor-pointer flex items-center gap-2 ${pathname.includes('my-resume') ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
					on:click={() => goto('/my-resume')}
				>
					{#if pathname.includes('my-resume')}
						<img src={pdfGrey} alt="" width="20" height="20" />
					{:else}
						<img src={pdfGrey} alt="" width="20" height="20" />
					{/if}
					<p>My Resume</p>
				</button>
				<button
					on:click={() => goto('/career-guide')}
					class={` text-[14px] font-normal p-2 rounded-[8px] cursor-pointer flex items-center gap-2 ${pathname.includes('cover-letter') ? 'bg-gradient text-white' : 'text-[#808990]'} w-full`}
				>
					{#if pathname.includes('cover-letter')}
						<img src={briefcaseGrey} alt="" width="20" height="20" />
					{:else}
						<img src={briefcaseGrey} alt="" width="20" height="20" />
					{/if}
					<p>Career Guide</p>
				</button>
			</div>

			<div class="flex flex-col justify-center items-center mt-7">
				<img src={noChat} alt="" width="80" height="80" />
				<p class="text-sm font-semibold text-[#80899A]">No Chat history</p>
			</div>
		</div>

		<!-- Learn more  -->

		<!-- Settings  -->
		<div>
			<button
				class="w-full flex items-center justify-between border rounded-[10px] py-3 px-2 mb-10"
			>
				<p class="text-[16px]">Learn more</p>
				<div class="rounded-full bg-gradient p-1">
					<ChevronRight color="white" size={15} />
				</div>
			</button>

			<h5 class="text-[#253B4B] text-[12px] mb-5 font-medium">Settings</h5>

			<div class="space-y-7 font-semibold text-[#80899A] text-sm">
				<button class="flex items-center gap-3">
					<img src={premium} alt="Rafiki X" width="20" height="20" />
					<p class="">Go premium today</p>
				</button>
				<button class="flex items-center gap-3">
					<img src={noProfile} alt="Rafiki X" width="20" height="20" />
					<p>My profile</p>
				</button>
				<button
					class="flex items-center gap-3"
					on:click={() => {
						goto('/login');
					}}
				>
					<img src={logout} alt="Rafiki X" width="20" height="20" />
					<p>Logout</p>
				</button>
			</div>
		</div>
	</div>
</aside>
