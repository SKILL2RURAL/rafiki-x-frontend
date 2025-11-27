<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import arrowIcon from '$lib/assets/icons/caret-left-fill.svg';
	import { auth } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import Feedback from '../Feedback.svelte';
	import FeedbackInput from '../FeedbackInput.svelte';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';

	let { children } = $props();

	let showFeedback = $state(false);
	let isFeedbackInput = $state(false);

	function closeFeedback() {
		showFeedback = false;
		isFeedbackInput = false;
	}

	let loading = $state(true);

	onMount(() => {
		if (browser) {
			const storedToken = localStorage.getItem('accessToken');
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
	<div class="flex items-center justify-center h-screen"></div>
{:else}
	<div
		class="flex [--sidebar-full-width:340px] [--sidebar-collapsed-width:80px] [--navbar-height:10vh] h-dvh max-h-screen w-screen overflow-hidden"
	>
		<Sidebar />
		<div class="w-full h-screen">
			<Navbar />
			<main class="p-5 h-[90vh] w-full overflow-auto mt-[--navbar-height] lg:mt-0">
				{@render children()}
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
