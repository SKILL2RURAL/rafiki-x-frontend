<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import linkedinIcon from '$lib/assets/icons/linkedln-icon.png';
	import facebookIcon from '$lib/assets/icons/facebook-icon.png';
	import twitterIcon from '$lib/assets/icons/x-icon.png';

	let {
		isOpen = false,
		onClose = () => {},
		onConfirm = () => {}
	}: {
		isOpen?: boolean;
		onClose?: () => void;
		onConfirm?: () => void;
	} = $props();

	function handleConfirm() {
		onConfirm();
		onClose();
	}
</script>

<BaseModal {isOpen} title="LOG OUT" {onClose}>
	<div class="mt-1">
		<!-- Confirmation Message -->
		<p class="text-white/80 text-[16px] mb-10 text-center">Are you sure you want to log out?</p>

		<!-- Primary Action Button -->
		<Button
			class="bg-gradient w-full rounded-[12px] h-[48px] border border-[#FFFFFF] mb-4"
			onclick={handleConfirm}
		>
			Yes, Log Out
		</Button>

		<!-- Secondary Action Button -->
		<Button
			variant="outline"
			class="bg-white text-[#51A3DA] shadow-lg border border-white rounded-[12px] h-[48px] w-full hover:bg-gray-50"
			onclick={onClose}
		>
			Cancel
		</Button>

		<!-- Social Media Icons -->
		<div
			class="flex items-center justify-around mt-8 font-semibold"
			style="font-family: 'Mullish', sans-serif;"
		>
			<div class="flex flex-col items-center gap-2">
				<div class="size-13 rounded-full bg-white shadow-lg flex items-center justify-center">
					<img src={linkedinIcon} alt="LinkedIn" class="size-[18px] object-contain" />
				</div>
				<span class="text-[14px] text-[#253B4B]">LinkedIn</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<div class="size-13 rounded-full bg-white shadow-lg flex items-center justify-center">
					<img src={facebookIcon} alt="Facebook" class="size-[18px] object-contain" />
				</div>
				<span class="text-[14px] text-[#253B4B]">Facebook</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<div class="size-13 rounded-full bg-white shadow-lg flex items-center justify-center">
					<img src={twitterIcon} alt="Twitter" class="size-[18px] object-contain" />
				</div>
				<span class="text-[14px] text-[#253B4B]">X(Twitter)</span>
			</div>
		</div>
	</div>
</BaseModal>
