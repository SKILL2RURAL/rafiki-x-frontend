<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import trash from '$lib/assets/icons/trash.svg';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { toast } from 'svelte-sonner';

	export let isOpen: boolean = false;
	export let onClose: (value: boolean) => void;

	let isLoading = false;

	async function handleDelete() {
		try {
			isLoading = true;
			// Call API to delete account
			await api.delete('/user/profile');
			toast.success('Account deleted successfully.');
			onClose(false);

			// Redirect to home page
			goto('/login');
			localStorage.clear();
		} catch (error) {
			console.error('Failed to delete account:', error);
			toast.error('Failed to delete account. Please try again.');
		} finally {
			isLoading = false;
		}
	}
</script>

<AlertDialog.Root open={isOpen} onOpenChange={onClose}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="text-center">Delete Account</AlertDialog.Title>
			<!-- <AlertDialog.Description class="text-[#808990] text-[24px] font-mulish font-normal">
				Deleting your account is permanent. Are you sure you want to proceed
			</AlertDialog.Description> -->
		</AlertDialog.Header>

		<img src={trash} alt="trash" width="150" height="150" class="mx-auto" />
		<div class="py-5 px-5">
			<p class="text-center text-[#253B4B] text-[24px] font-mulish font-bold">
				Are you sure you want to delete account?
			</p>
			<p class="text-[#808990] text-[24px] font-mulish font-normal text-center">
				Deleting your account is permanent. Are you sure you want to proceed
			</p>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel class="w-full sm:w-[50%]">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				disabled={isLoading}
				class="w-full sm:w-[50%] bg-red-500 hover:bg-red-600"
				onclick={handleDelete}
			>
				{#if isLoading}
					<Spinner />
				{:else}
					Delete Account
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
