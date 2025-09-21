<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';

	export let isOpen: boolean = false;
	export let onClose: () => void;

	let formData = {
		currentPassword: '',
		newPassoword: '',
		confirmPassword: ''
	};
</script>

<Dialog.Root open={isOpen} onOpenChange={onClose}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-center text-[24px] text-[#253B4B] font-bold font-mulish"
				>Change Password</Dialog.Title
			>
		</Dialog.Header>
		<div>
			<label for="password" class="text-sm">Password</label>
			<Input
				type="password"
				bind:value={formData.currentPassword}
				placeholder="Enter your email address"
				class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>
		<div>
			<label for="newPassword" class="text-sm">New Password</label>
			<Input
				type="text"
				bind:value={formData.newPassoword}
				placeholder="Enter your email address"
				class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>

		<div>
			<label for="confirmPassword" class="text-sm">Confirm Password</label>
			<Input
				type="password"
				bind:value={formData.confirmPassword}
				placeholder="Enter your email address"
				class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>

		<Button
			onclick={() => onClose()}
			class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px]"
			>Change Password</Button
		>
	</Dialog.Content>
</Dialog.Root>
