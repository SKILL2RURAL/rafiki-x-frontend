<script lang="ts">
	import arrowIcon from '$lib/assets/icons/caret-left-fill.svg';
	import Feedback from '../Feedback.svelte';
	import FeedbackInput from '../FeedbackInput.svelte';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';

	let showFeedback = $state(false);
	let isFeedbackInput = $state(false);

	function closeFeedback() {
		showFeedback = false;
		isFeedbackInput = false;
	}
</script>

<!-- Mount RightSidebar first to avoid undefined errors -->
<!-- <RightSidebar bind:this={rightSidebar} /> -->

<div
	class="flex [--sidebar-full-width:300px] [--sidebar-collapsed-width:80px] [--navbar-height:10vh] h-[100dvh] max-h-screen w-screen overflow-hidden"
>
	<Sidebar openHistory={() => {}} />
	<div class="w-full h-[100vh]">
		<Navbar />
		<!-- svelte-ignore slot_element_deprecated -->
		<main class="p-5 h-[90vh] w-full overflow-auto">
			<slot />
		</main>
	</div>

	<!-- FEEDBACK  -->

	<div class={`absolute top-1/2 -translate-y-1/2 right-0 hidden lg:flex`}>
		<button
			aria-label="feedback"
			class=" bg-gradient-to-r from-[#51A3DA] to-[#60269E] rounded-l-full p-1 h-[320px]"
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
