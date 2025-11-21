<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	export let isOpen: boolean = false;
	export let onClose: () => void;

	let isPasswordVisible: boolean = false;
	let isNewPasswordVisible: boolean = false;
	let isConfirmPasswordVisible: boolean = false;

	let formData = {
		currentPassword: '',
		newPassoword: '',
		confirmPassword: ''
	};

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}

	function toggleNewPasswordVisibility() {
		isNewPasswordVisible = !isNewPasswordVisible;
	}

	function toggleConfirmPasswordVisibility() {
		isConfirmPasswordVisible = !isConfirmPasswordVisible;
	}

	function handleChangePassword() {
		if (formData.newPassoword !== formData.confirmPassword) {
			toast.error('New password and confirm password do not match.');
			return;
		}

		onClose();
	}
</script>

<Dialog.Root open={isOpen} onOpenChange={onClose}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-center text-[24px] text-[#253B4B] font-bold font-mulish"
				>Change Password</Dialog.Title
			>
		</Dialog.Header>
		<form on:submit|preventDefault={handleChangePassword} class="space-y-5">
			<div>
				<label for="currentPassword" class="text-sm">Current Password</label>
				<div
					class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] flex gap-2 p-2 px-3 justify-between items-center"
				>
					<input
						type={!isPasswordVisible ? 'password' : 'text'}
						bind:value={formData.currentPassword}
						required
						placeholder="Enter Current Password"
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

			<div>
				<label for="newPassword" class="text-sm">New Password</label>
				<div
					class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] flex gap-2 p-2 px-3 justify-between items-center"
				>
					<input
						type={!isNewPasswordVisible ? 'password' : 'text'}
						bind:value={formData.newPassoword}
						required
						placeholder="Enter New Password"
						class="w-full outline-none placeholder:text-white placeholder:font-satoshi-regular placeholder:text-[14px]"
					/>
					<button
						type="button"
						on:click={toggleNewPasswordVisibility}
						aria-label={isNewPasswordVisible ? 'Hide password' : 'Show password'}
					>
						{#if isNewPasswordVisible}
							<Eye size={20} cursor="pointer" />
						{:else}
							<EyeOff size={20} cursor="pointer" />
						{/if}
					</button>
				</div>
			</div>

			<div>
				<label for="confirmPassword" class="text-sm">Confirm Password</label>
				<div
					class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] flex gap-2 p-2 px-3 justify-between items-center"
				>
					<input
						type={!isConfirmPasswordVisible ? 'password' : 'text'}
						bind:value={formData.confirmPassword}
						required
						placeholder="Enter Confirm Password"
						class="w-full outline-none placeholder:text-white placeholder:font-satoshi-regular placeholder:text-[14px]"
					/>
					<button
						type="button"
						on:click={toggleConfirmPasswordVisibility}
						aria-label={isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
					>
						{#if isConfirmPasswordVisible}
							<Eye size={20} cursor="pointer" />
						{:else}
							<EyeOff size={20} cursor="pointer" />
						{/if}
					</button>
				</div>
			</div>

			<Button
				type="submit"
				class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px]"
				>Change Password</Button
			>
		</form>
	</Dialog.Content>
</Dialog.Root>
