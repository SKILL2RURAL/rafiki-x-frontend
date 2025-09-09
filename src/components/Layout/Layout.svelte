<script lang="ts">
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
	import RightSidebar from './RightSidebar.svelte';
	import ChatHistory from '../history/ChatHistory.svelte';

	let rightSidebar: RightSidebar | null = null;

	function openRightSidebar(component: any, title: string) {
		rightSidebar?.show(component, title);
	}
</script>

<!-- Mount RightSidebar first to avoid undefined errors -->
<RightSidebar bind:this={rightSidebar} />

<div class="flex [--sidebar-width:300px] [--navbar-height:10vh] h-screen">
	<Sidebar openHistory={() => openRightSidebar(ChatHistory, 'Chat History')} />
	<div class="w-full h-[100vh] overflow-auto">
		<Navbar />
		<main class="p-5 h-[90vh] w-full">
			<slot {rightSidebar} />
		</main>
	</div>
</div>
