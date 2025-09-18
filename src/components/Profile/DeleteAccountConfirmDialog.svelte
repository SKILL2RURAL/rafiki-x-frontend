<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import trash from '$lib/assets/icons/trash.svg';

	export let isOpen: boolean = false;
	export let onClose: (value: boolean) => void;
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
			<AlertDialog.Cancel class="w-[50%]">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class="w-[50%] bg-red-500 hover:bg-red-600"
				>Delete Account</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
