<script>
	import Layout from '../../components/Layout/Layout.svelte';
	import WelcomeScreen from '../../components/WelcomeScreen.svelte';
	import logo from '$lib/assets/icons/logo-gradient.png';
</script>

<Layout>
	<div class="w-full h-full flex flex-col items-center mt-10 mb-10 lg:justify-center">
		<img src={logo} alt="Rafiki X" width="38" height="38" class="mb-5" />
		<WelcomeScreen />
	</div>
</Layout>
