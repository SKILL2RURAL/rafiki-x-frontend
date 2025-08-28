<script>
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
</script>

<div class="flex [--sidebar-width:300px] [--navbar-height:80px]">
	<Sidebar />
	<div class="w-full h-screen">
		<Navbar />
		<main class="p-5">
			<slot />
		</main>
	</div>
</div>
