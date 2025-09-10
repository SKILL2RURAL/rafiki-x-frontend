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

<div class="flex [--sidebar-width:300px] [--navbar-height:10vh] h-screen w-screen overflow-hidden">
	<Sidebar openHistory={() => {}} />
	<div class="w-full h-[100vh] overflow-auto">
		<Navbar />
		<!-- svelte-ignore slot_element_deprecated -->
		<main class="p-5 h-[90vh] w-full">
			<slot />
		</main>
	</div>

	<!-- FEEDBACK  -->
	<div
		class={`absolute top-1/2 -translate-y-1/2  ${showFeedback ? 'translate-x-0' : 'translate-x-[800px]'} transition-all duration-500 right-0 flex overflow-hidden`}
	>
		<button
			aria-label="feedback"
			class=" bg-gradient-to-r from-[#51A3DA] to-[#60269E] rounded-l-full p-2"
			onclick={() => (showFeedback = !showFeedback)}
		>
			<img src={arrowIcon} alt="arrow icon" width="24" height="24" />
		</button>
		{#if isFeedbackInput}
			<FeedbackInput {closeFeedback} />
		{:else}
			<Feedback showFeedbackInput={() => (isFeedbackInput = true)} />
		{/if}
	</div>
</div>
