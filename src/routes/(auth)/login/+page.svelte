<script lang="ts">
	import AshBackground from '../../../lib/assets/img/ash-background.png';
	import logo from '../../../lib/assets/img/logo-white.png';
	import google from '../../../lib/assets/icons/google.png';
	import LoginForm from '../../../components/Login/LoginForm.svelte';
</script>

<div class="relative bg-gradient">
	<img
		src={AshBackground}
		alt="Rafiki X"
		width="100%"
		height="100%"
		class="h-screen w-screen z-[-1] top-0 left-0 opacity-50"
	/>
	<div
		class="absolute top-0 left-0 z-[50] h-screen w-screen flex flex-col items-center justify-center lg:grid grid-cols-2 gap-5"
	>
		<div class="flex justify-center items-center px-10">
			<img
				src={logo}
				alt="Rafiki X"
				width="500"
				height="500"
				class="w-[100px] h-[100px] lg:w-[500px] lg:h-[500px]"
			/>
		</div>
		<div class="flex justify-center items-center">
			<div class="text-white lg:w-[400px] px-5">
				<h1 class="font-plus-jakarta-sans-semibold text-[30px] text-center lg:text-left">
					Welcome, Login
				</h1>
				<p class="text-sm font-satoshi-regular text-center lg:text-left">
					Please provide your login credentials
				</p>
				<button
					class="my-5 bg-white rounded-[12px] p-4 py-3 w-full flex gap-2 justify-center items-center"
				>
					<img src={google} alt="Google" width="20" height="20" />
					<p class="text-sm font-plus-jakarta-sans-medium text-primary-color">log in with Google</p>
				</button>

				<hr class="my-3 border-[#C8CCD0]" />
				<p class="text-center font-plus-jakarta-sans-medium text-sm">Or Continue with</p>

				<LoginForm />
				<a href="/register">
					<p class="mt-5 text-sm font-plus-jakarta-sans-medium text-center">
						Dont have an account? <span class="underline">Create an account in seconds</span>
					</p>
				</a>
			</div>
		</div>
	</div>
</div>
