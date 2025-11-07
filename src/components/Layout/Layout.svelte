<script lang="ts">
	import arrowIcon from '$lib/assets/icons/caret-left-fill.svg';
	import { onMount } from 'svelte';
	import Feedback from '../Feedback.svelte';
	import FeedbackInput from '../FeedbackInput.svelte';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
	import { browser } from '$app/environment';
	import { auth } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { getCookie } from '$lib/utils/cookies';

	let showFeedback = $state(false);
	let isFeedbackInput = $state(false);

	function closeFeedback() {
		showFeedback = false;
		isFeedbackInput = false;
	}

	let loading = $state(true);

	onMount(() => {
		if (browser) {
			const storedToken = getCookie('accessToken');
			if (!storedToken) {
				loading = false;
				goto('/login');
				return;
			}
			auth.update((s) => ({ ...s, accessToken: storedToken }));
			loading = false;
		}
	});
</script>

<!-- Mount RightSidebar first to avoid undefined errors -->
<!-- <RightSidebar bind:this={rightSidebar} /> -->

<!-- If loading  -->
{#if loading}
	<div class="flex items-center justify-center h-screen">
		<div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
	</div>
{:else}
	<div
		class="flex [--sidebar-full-width:300px] [--sidebar-collapsed-width:80px] [--navbar-height:10vh] h-dvh max-h-screen w-screen overflow-hidden"
	>
		<Sidebar openHistory={() => {}} />
		<div class="w-full h-screen">
			<Navbar />
			<!-- svelte-ignore slot_element_deprecated -->
			<main class="p-5 max-h-[90vh] w-full overflow-auto">
				<slot />
			</main>
		</div>

		<!-- FEEDBACK  -->

		<div class={`absolute top-1/2 -translate-y-1/2 right-0 hidden lg:flex`}>
			<button
				aria-label="feedback"
				class=" bg-linear-to-r from-[#51A3DA] to-[#60269E] rounded-l-full p-1 h-[320px]"
				onclick={() => (showFeedback = !showFeedback)}
			>
				<img src={arrowIcon} alt="arrow icon" width="20" height="20" />
			</button>

			<div class={showFeedback ? 'block' : 'hidden'}>
				{#if isFeedbackInput}
					<FeedbackInput {closeFeedback} />
				{:else}
					<Feedback showFeedbackInput={() => (isFeedbackInput = true)} />
				{/if}
			</div>
		</div>
	</div>
{/if}
