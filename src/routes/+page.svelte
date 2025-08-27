<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import logo from '../lib/assets/img/logo-white.png';
	import google from '../lib/assets/icons/google.png';
</script>

<div class="bg-black h-screen w-screen grid grid-cols-2 gap-5">
	<div class="flex justify-center items-center">
		<img src={logo} alt="Rafiki X" width="600" height="600" />
	</div>
	<div class="flex justify-center items-center">
		<div class="text-white w-[400px]">
			<h1 class="font-plus-jakarta-sans-semibold text-[30px]">Welcome, Login</h1>
			<p class="text-sm font-satoshi-regular">Please provide your login credentials</p>
			<button
				class="my-5 bg-white rounded-[12px] p-4 py-3 w-full flex gap-2 justify-center items-center"
			>
				<img src={google} alt="Google" width="20" height="20" />
				<p class="text-sm font-plus-jakarta-sans-medium text-primary-color">log in with Google</p>
			</button>

			<hr class="my-3 border-[#C8CCD0]" />
			<p class="text-center font-plus-jakarta-sans-medium text-sm">Or Continue with</p>

			<form class="space-y-5">
				<div>
					<label for="email" class="text-sm">Email</label>
					<Input
						type="email"
						placeholder="Enter your email address"
						class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
					/>
				</div>

				<div>
					<label for="password" class="text-sm">Password</label>
					<div
						class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] flex gap-2 p-2"
					>
						<input
							type="email"
							placeholder="Enter Password"
							class="w-full outline-none placeholder:text-white placeholder:font-satoshi-regular"
						/>
					</div>
				</div>

				<div class="text-[12px] flex justify-between items-center font-satoshi-regular">
					<div class="flex items-center gap-2">
						<Checkbox />
						<p>Remember me</p>
					</div>
					<a href="/">Forget Password?</a>
				</div>
				<Button class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px]"
					>Log in</Button
				>
			</form>
		</div>
	</div>
</div>
