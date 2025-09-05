<script>
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
	import RightSidebar from './RightSidebar.svelte';

	let rightSidebar;
</script>

<!-- Mount RightSidebar first to avoid undefined errors -->
<RightSidebar bind:this={rightSidebar} />

<div class="flex [--sidebar-width:300px] [--navbar-height:80px]">
	<Sidebar />
	<div class="w-full h-screen">
		<Navbar />
		<main class="p-5">
			<slot {rightSidebar}/>
		</main>
	</div>
</div>
 