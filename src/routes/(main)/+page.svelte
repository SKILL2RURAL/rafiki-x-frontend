<script>
	import logo from '$lib/assets/icons/logo-gradient.png';
	import Layout from '../../components/main/Layout/Layout.svelte';
	import WelcomeScreen from '../../components/WelcomeScreen.svelte';
</script>

<Layout>
	<div
		class="w-full min-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 py-10 lg:py-0"
	>
		<img src={logo} alt="Rafiki X" width="38" height="38" class="mb-4 md:mb-6" />
		<div class="w-full max-w-6xl">
			<WelcomeScreen />
		</div>
	</div>
</Layout>
