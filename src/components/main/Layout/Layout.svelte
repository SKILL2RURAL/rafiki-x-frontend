<script lang="ts">
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import arrowIcon from '$lib/assets/icons/caret-left-fill.svg';
	import { auth } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
	import FeedbackInput from '../FeedbackInput.svelte';
	import Feedback from '../../Feedback.svelte';
	import CreateAccountModal from './CreateAccountModal.svelte';

	let { children } = $props();

	let showFeedback = $state(false);
	let isFeedbackInput = $state(false);

	function closeFeedback() {
		showFeedback = false;
		isFeedbackInput = false;
	}

	let loading = $state(true);
	let isCreateAccountOpen = $state(false);

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

<!-- If loading  -->
{#if loading}
	<div class="flex items-center justify-center h-screen"></div>
{:else}
	<div
		class="flex [--sidebar-full-width:340px] [--sidebar-collapsed-width:80px] [--navbar-height:7vh] h-dvh max-h-screen w-screen overflow-hidden bg-[#fcfcfc]"
	>
		<Sidebar onOpenCreateAccount={() => (isCreateAccountOpen = true)} />
		<div class="w-full h-screen">
			<Navbar />
			<main class="p-5 pt-0 lg:pl-0 lg:pr-8 lg:pb-5 lg:pt-0 w-full">
				<div
					class="bg-white rounded-[20px] border border-[#E8E8E8] h-[90vh] w-full overflow-y-auto p-5 lg:ml-3"
				>
					{@render children()}
				</div>
			</main>
		</div>

		<!-- FEEDBACK  -->
		<div class={`absolute top-1/2 -translate-y-1/2 right-0 hidden lg:flex`}>
			{#if showFeedback}
				<div
					class="flex items-stretch"
					in:fly={{ x: 320, duration: 250 }}
					out:fly={{ x: 320, duration: 200 }}
				>
					<button
						aria-label="feedback"
						class=" bg-linear-to-r from-[#51A3DA] to-[#60269E] rounded-l-full p-1 h-[320px]"
						onclick={() => (showFeedback = false)}
					>
						<img src={arrowIcon} alt="arrow icon" width="20" height="20" />
					</button>
					{#if isFeedbackInput}
						<FeedbackInput {closeFeedback} />
					{:else}
						<Feedback showFeedbackInput={() => (isFeedbackInput = true)} />
					{/if}
				</div>
			{:else}
				<div class="flex items-stretch">
					<button
						aria-label="feedback"
						class=" bg-linear-to-r from-[#51A3DA] to-[#60269E] rounded-l-full p-1 h-[320px]"
						onclick={() => (showFeedback = true)}
					>
						<img src={arrowIcon} alt="arrow icon" width="20" height="20" />
					</button>
				</div>
			{/if}
		</div>
	</div>
	<CreateAccountModal isOpen={isCreateAccountOpen} onClose={() => (isCreateAccountOpen = false)} />
{/if}
