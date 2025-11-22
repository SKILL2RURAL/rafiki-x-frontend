<script lang="ts">
	import { api } from '$lib/api';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { fetchProfile } from '$lib/stores/profile';

	export let isOpen: boolean = false;
	export let onClose: () => void;

	let isPasswordVisible = false;
	let isNewPasswordVisible = false;
	let isConfirmPasswordVisible = false;

	let formData = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	};

	let isLoading = false;

	async function handleChangePassword(event) {
		event.preventDefault();

		try {
			isLoading = true;

			await api.post('/user/change-password', {
				currentPassword: formData.currentPassword,
				newPassword: formData.newPassword,
				confirmNewPassword: formData.confirmPassword
			});

			toast.success('Password changed successfully!');
			await fetchProfile();
			onClose(); // close only AFTER successful API call

		} catch (error) {
			console.error(error);
			toast.error('Failed to change password. Please try again.');
		} finally {
			isLoading = false;
		}
	}
</script>

<Dialog.Root
	open={isOpen}
	onOpenChange={(value) => {
		// Only trigger onClose when user clicks outside / ESC
		if (!value) onClose();
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-center text-[24px] text-[#253B4B] font-bold font-mulish">
				Change Password
			</Dialog.Title>
		</Dialog.Header>

		<form onsubmit = {handleChangePassword} class="space-y-5">
			
			<!-- Current Password -->
			<div>
				<label for="currentPassword" class="text-sm">Current Password</label>
				<div class="mt-2 border border-[#D0D5DD] h-10 rounded-xl flex gap-2 p-2 px-3 items-center">
					<input
						id="currentPassword"
						type={isPasswordVisible ? 'text' : 'password'}
						bind:value={formData.currentPassword}
						required
						placeholder="Enter Current Password"
						class="w-full outline-none placeholder:text-[#999] text-black"
					/>
					<button type="button" onclick={() => (isPasswordVisible = !isPasswordVisible)}>
						{#if isPasswordVisible}
							<Eye size={20} />
						{:else}
							<EyeOff size={20} />
						{/if}
					</button>
				</div>
			</div>
			<!-- New Password -->
			<div>
				<label for="newPassword" class="text-sm">New Password</label>
				<div class="mt-2 border border-[#D0D5DD] h-10 rounded-xl flex gap-2 p-2 px-3 items-center">
					<input
						id="newPassword"
						type={isNewPasswordVisible ? 'text' : 'password'}
						bind:value={formData.newPassword}
						required
						placeholder="Enter New Password"
						class="w-full outline-none placeholder:text-[#999] text-black"
					/>
					<button type="button" onclick={() => (isNewPasswordVisible = !isNewPasswordVisible)}>
						{#if isNewPasswordVisible}
							<Eye size={20} />
						{:else}
							<EyeOff size={20} />
						{/if}
					</button>
				</div>
			</div>
			<!-- Confirm Password -->
			<div>
				<label for="confirmPassword" class="text-sm">Confirm Password</label>
				<div class="mt-2 border border-[#D0D5DD] h-10 rounded-xl flex gap-2 p-2 px-3 items-center">
					<input
						id="confirmPassword"
						type={isConfirmPasswordVisible ? 'text' : 'password'}
						bind:value={formData.confirmPassword}
						required
						placeholder="Enter Confirm Password"
						class="w-full outline-none placeholder:text-[#999] text-black"
					/>
					<button type="button" onclick={() => (isConfirmPasswordVisible = !isConfirmPasswordVisible)}>
						{#if isConfirmPasswordVisible}
							<Eye size={20} />
						{:else}
							<EyeOff size={20} />
						{/if}
					</button>
				</div>
			</div>
			<Button
				type="submit"
				disabled={isLoading}
				class="bg-gradient w-full rounded-xl mt-5 border border-[#FFFFFF] h-[50px]"
			>
				{#if isLoading}
					Processing...
				{:else}
					Change Password
				{/if}
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
