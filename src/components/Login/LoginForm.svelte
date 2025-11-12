<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { auth, isLoading, login } from '$lib/stores/authStore';
	import { AxiosError } from 'axios';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let isPasswordVisible = false;

	let formData = {
		email: '',
		password: ''
	};
	async function handleSubmit() {
		try {
			await login(formData);
			goto('/');
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.data.message === 'Please verify your email before logging in') {
					goto('/verify-email');
					auth.update((state) => ({ ...state, isLoading: false, email: formData.email }));
					toast.error('Please verify your email before logging in');
				} else {
					toast.error(error.response?.data.message);
				}
			}
		}
	}

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}
</script>

<form class="space-y-5" on:submit|preventDefault={handleSubmit}>
	<div>
		<label for="email" class="text-sm">Email</label>
		<Input
			type="email"
			bind:value={formData.email}
			placeholder="Enter your email address"
			class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
		/>
	</div>

	<div>
		<label for="password" class="text-sm">Password</label>
		<div
			class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] flex gap-2 p-2 px-3 justify-between items-center"
		>
			<input
				type={!isPasswordVisible ? 'password' : 'text'}
				bind:value={formData.password}
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

	<div class="text-[12px] flex justify-between items-center font-satoshi-regular">
		<div class="flex items-center gap-2">
			<Checkbox />
			<p>Remember me</p>
		</div>
		<a href="/">Forget Password?</a>
	</div>
	<Button
		type="submit"
		class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px]"
		disabled={!formData.email || !formData.password}
	>
		{#if $isLoading}
			<Spinner />
		{:else}
			Log in
		{/if}
	</Button>
</form>
