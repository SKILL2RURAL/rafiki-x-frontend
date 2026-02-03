<script lang="ts">
	// import Button from '$lib/components/ui/button/button.svelte';
	import { Menu } from 'lucide-svelte';
	import logo from '$lib/assets/logo.svg';
	import premium from '$lib/assets/icons/premium.png';
	import noProfile from '$lib/assets/icons/no-profile.png';
	import { getStores } from '$app/stores';
	import MobileSidebar from './MobileSidebar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/authStore';
	import { profile } from '$lib/stores/profile';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	const { page } = getStores();
	let { onOpenCreateAccount }: { onOpenCreateAccount?: () => void } = $props();
	const pathname = $derived($page.url.pathname);

	let isSidebarOpen = $state(false);

	let links = [
		{ name: 'My Resume', href: '/my-resume' },
		{ name: 'Chat', href: '/' },
		{ name: 'Career Guide', href: '/career-guide' }
	];
</script>

<nav
	class="min-h-(--navbar-height) flex justify-between lg:justify-end items-center p-5 bg-[#fcfcfc]"
>
	<div class="flex lg:hidden items-center justify-between w-full">
		<button
			onclick={() => {
				isSidebarOpen = !isSidebarOpen;
			}}
		>
			<Menu size={30} class="cursor-pointer" />
		</button>

		{#if !$auth.accessToken}
			<Button class="bg-gradient h-10 w-[100px]" onclick={() => goto('/login')}>Sign In</Button>
		{:else}
			<div class="flex justify-center items-center gap-2 overflow-auto text-[16px] w-full">
				{#each links as link}
					<a
						href={link.href}
						class={`block py-1 text-center ${pathname === link.href ? 'bg-linear-to-r from-[#51A3DA] to-[#60269E] bg-clip-text text-transparent border-b border-[#51A3DA]' : 'text-[#808990]'}`}
						>{link.name}</a
					>
				{/each}
			</div>
			<button onclick={() => goto('/')}>
				<img src={logo} alt="logo" class="h-5 w-[50px]" />
			</button>
		{/if}
	</div>
	{#if !$auth.accessToken}
		<Button class="hidden lg:block bg-gradient h-10 w-[100px]" onclick={() => goto('/login')}
			>Sign In</Button
		>
	{:else}
		<!-- Go Premium Button and Avatar for authenticated users -->
		<div class="hidden lg:flex items-center gap-3">
			<button
				onclick={() => goto('/subscription')}
				class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
			>
				<img src={premium} alt="Premium" width="20" height="20" />
				<span>Go Premium</span>
			</button>
		</div>
	{/if}
</nav>
<MobileSidebar
	isOpen={isSidebarOpen}
	onClose={() => (isSidebarOpen = false)}
	{onOpenCreateAccount}
/>
