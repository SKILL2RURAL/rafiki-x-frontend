<script lang="ts">
	import { auth } from '$lib/stores/authStore';
	// import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo.svg';

	const publicRoutes = [
		'/',
		'/login',
		'/register',
		'/forget-password',
		'/reset-password',
		'/verify-email',
		'/subscription',
		'/my-resume',
		'/carerr-guide',
		'/[chatId]',
		'/learn-more',
		'/terms-and-conditions'
	];

	onMount(() => {
		const unsubscribe = auth.subscribe(($auth) => {
			if ($auth.isInitialAuthCheckComplete) {
				const currentPath = page.url.pathname;
				if (!$auth.accessToken && !publicRoutes.includes(currentPath)) {
					// goto('/login');
				}
			}
		});

		return unsubscribe;
	});
</script>

{#if !$auth.isInitialAuthCheckComplete}
	<div class="fixed inset-0 flex items-center justify-center bg-white">
		<img src={logo} alt="Loading..." class="w-32 h-32 animate-pulse repeat-infinite" />
	</div>
{:else}
	<slot />
{/if}
