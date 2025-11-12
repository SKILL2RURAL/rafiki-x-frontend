<script>
	import logo from '$lib/assets/icons/logo-gradient.png';
	import Layout from '../../components/Layout/Layout.svelte';
	import WelcomeScreen from '../../components/WelcomeScreen.svelte';
</script>

<Layout>
	<div class="w-full h-full flex flex-col items-center my-10 lg:justify-center">
		<img src={logo} alt="Rafiki X" width="38" height="38" class="mb-5" />
		<WelcomeScreen />
	</div>
</Layout>
