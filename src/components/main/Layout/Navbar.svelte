<script>
	// import Button from '$lib/components/ui/button/button.svelte';
	import { Menu } from 'lucide-svelte';
	import logo from '$lib/assets/logo.svg';
	import { getStores } from '$app/stores';
	import MobileSidebar from './MobileSidebar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	const { page } = getStores();
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
	<Button
		class="bg-linear-to-br from-[#51A3DA] to-[#60269E] rounded-[4px] text-[16px] font-bold px-8 py-6"
		onclick={() => goto('/login')}>Sign In</Button
	>
	<div class="flex lg:hidden items-center justify-between w-full">
		<button
			onclick={() => {
				isSidebarOpen = !isSidebarOpen;
			}}
		>
			<Menu size={30} class="cursor-pointer" />
		</button>

		<div class="flex justify-center items-center gap-2 overflow-auto text-[16px] w-full">
			{#each links as link}
				<a
					href={link.href}
					class={`block py-1 text-center ${pathname === link.href ? 'bg-linear-to-r from-[#51A3DA] to-[#60269E] bg-clip-text text-transparent border-b border-[#51A3DA]' : 'text-[#808990]'}`}
					>{link.name}</a
				>
			{/each}
		</div>
		<img src={logo} alt="logo" class="h-[20px] w-[50px]" />
	</div>
	<!-- <Button class="bg-gradient h-[40px] w-[100px] hidden lg:block">Sign in</Button> -->
</nav>
<MobileSidebar isOpen={isSidebarOpen} onClose={() => (isSidebarOpen = false)} />
