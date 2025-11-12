<script>
	import { goto } from '$app/navigation';
	import AshBackground from '$lib/assets/img/ash-background.png';
	import logo from '$lib/assets/img/logo-white.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { resendCode, user, verifyEmail } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let isLoading = false;
	let isSendingCode = false;
	let verificationCode = '';

	async function handleVerifyEmail() {
		isLoading = true;
		if (!$user.email) {
			goto('/register');
			return;
		}

		try {
			await verifyEmail({ email: $user.email, code: verificationCode });
			toast.success('Email verified successfully');
			goto('/login');
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	}

	async function handleResendCode() {
		// CHECK IF EMAIL EXISTS IN STORE BEFORE SENDING CODE
		if (!$user.email) return;

		isSendingCode = true;

		// SEND RESEND CODE
		await resendCode($user.email);
		isSendingCode = false;
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
		class="absolute top-0 left-0 overflow-scroll lg:h-screen w-screen flex flex-col items-center justify-center lg:grid grid-cols-2 gap-5 pt-10 z-50 text-white"
	>
		<!-- LOGO  -->
		<div class="flex justify-center items-center">
			<img
				src={logo}
				alt="Rafiki X"
				width="500"
				height="500"
				class="w-[100px] h-[100px] lg:w-[500px] lg:h-[500px]"
			/>
		</div>

		<!-- FORM  -->
		<div class="max-w-[400px] font-mullish mx-auto">
			<h2 class="text-[30px] font-semibold font-mulish">Welcome to RafikiX</h2>
			<p class="text-[14px] font-normal mb-5">
				Please enter verification code sent to your registered email address
			</p>
			<form on:submit|preventDefault={handleVerifyEmail}>
				<div>
					<label for="verificationCode" class="text-sm">Verification Code</label>
					<Input
						type="text"
						bind:value={verificationCode}
						placeholder="Enter verification code"
						class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
					/>
				</div>

				<Button
					class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px]"
					type="submit"
				>
					{#if isLoading}
						<Spinner />
					{:else}
						Continue
					{/if}
				</Button>

				<button
					type="button"
					class="text-sm text-[#D0D5DD] font-semibold mt-4 mx-auto w-full disabled:opacity-20 disabled:cursor-not-allowed"
					disabled={isSendingCode}
					on:click={handleResendCode}
				>
					Resend Code
				</button>
			</form>
		</div>
	</div>
</div>
