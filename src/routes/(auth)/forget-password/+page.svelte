<script lang="ts">
	import AshBackground from '$lib/assets/img/ash-background.webp';
	import logo from '$lib/assets/img/logo-white.png';
	import sendIcon from '$lib/assets/icons/send-icon.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { goto } from '$app/navigation';
	import { forgetPassword } from '$lib/stores/authStore';

	let emailAddress = '';
	let isLoading = false;
	let isModalOpen = false;

	async function sendResetLink() {
		if (!emailAddress.trim()) return;
		isLoading = true;

		try {
			await forgetPassword(emailAddress.trim());
			isModalOpen = true;
		} catch (error) {
			console.log(error);
			throw error;
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
			<h2 class="text-[30px] font-plus-jakarta-sans-semibold">Reset Your Password</h2>
			<p class="text-[14px] font-normal font-satoshi-regular mb-5">
				Enter the email associated with your Rafiki X account and we’ll send you a link to reset
				your password.
			</p>
			<form on:submit|preventDefault={sendResetLink}>
				<div>
					<label for="email address" class="text-sm">Email</label>
					<Input
						type="email"
						required
						bind:value={emailAddress}
						placeholder="Enter email address"
						class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
					/>
				</div>

				<Button
					class="bg-gradient w-full rounded-[8px] mt-8 border border-[#FFFFFF] h-[50px]"
					type="submit"
				>
					{#if isLoading}
						<Spinner />
					{:else}
						Send Reset Link
					{/if}
				</Button>

				<a href="/login">
					<p class="mt-5 text-sm font-plus-jakarta-sans-medium text-center">
						Remember password? <span class="underline">Return to LOGIN</span>
					</p>
				</a>
			</form>
		</div>
	</div>
</div>

<!-- Modal  -->
<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="flex flex-col items-center gap-4"
				><div class="space-y-5">
					<img src={sendIcon} alt="" width="80" height="80" class="mx-auto" />
					<h3 class="text-[#253B4B] text-[24px]">Check your email</h3>
				</div>
			</Dialog.Title>

			<p class="text-[18px] text-[#808990] font-light text-justify mt-6">
				We&apos;ve sent a password reset link to your email address. Click the link to create a new
				password and get back into your account.
			</p>
			<p class="text-[18px] text-[#808990] font-light text-justify mt-3">
				If you don&apos;t see the email in a few minutes, check your Spam or Promotions folder.
			</p>

			<Button
				class="bg-gradient w-full rounded-[8px] mt-8 border border-[#FFFFFF] h-[50px]"
				type="submit"
				onclick={() => {
					isModalOpen = false;
				}}
			>
				Continue
			</Button>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
