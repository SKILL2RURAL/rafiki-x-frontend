<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AshBackground from '$lib/assets/img/ash-background.webp';
	import logo from '$lib/assets/img/logo-white.png';
	import Button from '$lib/components/ui/button/button.svelte';
	// import Input from '$lib/components/ui/input/input.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { resetPassword } from '$lib/stores/authStore';
	import { Axios, AxiosError } from 'axios';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let isLoading = false;
	let password = '';
	let confirmPassword = '';
	let isPasswordVisible = false;
	let isConfirmPasswordVisible = false;

	$: token = $page.url.searchParams.get('token');

	$: {
		if (!token) {
			toast.error('Invalid token');
			goto('/login');
		}
	}

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}

	function toogleConfirmPasswordVisibility() {
		isConfirmPasswordVisible = !isConfirmPasswordVisible;
	}

	async function handleResetPassword() {
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		isLoading = true;

		try {
			await resetPassword(token as string, password);
			goto('/login');
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message || 'Failed to reset password. Please try again.');
			}
		} finally {
			isLoading = false;
		}
	}
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
		class="absolute top-0 left-0 overflow-scroll lg:h-screen w-screen flex flex-col items-center justify-center lg:grid grid-cols-2 gap-5 pt-10 z-50"
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
		<div class="max-w-[400px] font-mullish mx-auto text-white">
			<h2 class="text-[30px] font-plus-jakarta-sans-semibold">Create a New Password</h2>
			<p class="text-[14px] font-normal font-satoshi-regular mb-5">
				Your new password should be at least 8 characters long. Make sure it&apos;s something secure
				and easy for you to remember.
			</p>
			<form on:submit|preventDefault={handleResetPassword} class="space-y-5">
				<div>
					<label for="password" class="text-sm">Password</label>
					<div
						class="mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] flex gap-2 p-2 px-3 justify-between items-center"
					>
						<input
							name="password"
							autocomplete="off"
							required
							spellcheck="false"
							type={!isPasswordVisible ? 'password' : 'text'}
							bind:value={password}
							placeholder="Enter Password"
							class="w-full outline-none placeholder:text-white placeholder:font-satoshi-regular placeholder:text-[14px]"
						/>
						<button
							type="button"
							on:click={togglePasswordVisibility}
							aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
						>
							{#if isPasswordVisible}
								<Eye size={20} cursor="pointer" />
							{:else}
								<EyeOff size={20} cursor="pointer" />
							{/if}
						</button>
					</div>
				</div>

				<!-- CONFIRM PASSWORD  -->
				<div>
					<label for="confirm password" class="text-sm">Confirm Password</label>
					<div
						class="mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] flex gap-2 p-2 px-3 justify-between items-center"
					>
						<input
							name="confirm-password"
							autocomplete="off"
							required
							spellcheck="false"
							type={!isConfirmPasswordVisible ? 'password' : 'text'}
							bind:value={confirmPassword}
							placeholder="Enter Password"
							class="w-full outline-none placeholder:text-white placeholder:font-satoshi-regular placeholder:text-[14px]"
						/>
						<button
							type="button"
							on:click={toogleConfirmPasswordVisibility}
							aria-label={isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
						>
							{#if isPasswordVisible}
								<Eye size={20} cursor="pointer" />
							{:else}
								<EyeOff size={20} cursor="pointer" />
							{/if}
						</button>
					</div>
				</div>

				<Button
					class="bg-gradient w-full rounded-xl mt-8 border border-[#FFFFFF] h-[50px]"
					type="submit"
				>
					{#if isLoading}
						<Spinner />
					{:else}
						Confirm New Password
					{/if}
				</Button>

				<a href="/login">
					<p class="text-sm font-plus-jakarta-sans-medium text-center">
						Remember password? <span class="underline">Return to LOGIN</span>
					</p>
				</a>
			</form>
		</div>
	</div>
</div>
