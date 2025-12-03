<script lang="ts">
	import AshBackground from '$lib/assets/img/ash-background.webp';
	import logo from '$lib/assets/img/logo-white.png';
	import RegisterForm from '../../../components/auth/Register/RegisterForm.svelte';
	// import google from '../../../lib/assets/icons/google.png';la
</script>

<div class="bg-gradient">
	<img
		src={AshBackground}
		alt="Rafiki X"
		width="100%"
		height="100%"
		class="h-screen w-screen z-[-1] top-0 left-0 opacity-50"
	/>
	<div
		class="bg-gradient absolute top-0 left-0 overflow-scroll lg:h-screen w-screen flex flex-col items-center justify-center lg:grid grid-cols-2 gap-5 pt-10 z-50"
	>
		<div class="flex justify-center items-center">
			<img
				src={logo}
				alt="Rafiki X"
				width="500"
				height="500"
				class="w-[100px] h-[100px] lg:w-[500px] lg:h-[500px]"
			/>
		</div>
		<div class="flex justify-center items-center lg:h-full">
			<div class="text-white lg:max-h-screen lg:overflow-auto py-5 lg:w-[500px] px-5">
				<h1 class="font-plus-jakarta-sans-semibold text-[30px] text-center lg:text-left">
					Welcome to RafikiX
				</h1>
				<p class="text-sm font-satoshi-regular text-center lg:text-left">
					Getting started is easy and only takes a few seconds.
				</p>

				<!-- REGISTER WITH GOOGLE HAS BEEN COMMENTED OUT FOR NOW  -->
				<!-- <button
					class="my-5 bg-white rounded-[12px] p-4 py-3 w-full flex gap-2 justify-center items-center"
				>
					<img src={google} alt="Google" width="20" height="20" />
					<p class="text-sm font-plus-jakarta-sans-medium text-primary-color">
						Sign up with Google
					</p>
				</button>

				<hr class="my-3 border-[#C8CCD0]" />
				<p class="text-center font-plus-jakarta-sans-medium text-sm">Or Continue with</p> -->

				<div class="h-7"></div>

				<RegisterForm />

				<a href="/login">
					<p class="mt-5 mb-5 lg:mb-0 text-sm font-plus-jakarta-sans-medium text-center">
						Already have an account? <span class="underline">Login with your details</span>
					</p>
				</a>
			</div>
		</div>
	</div>
</div>
