<script lang="ts">
	import BaseModal from './BaseModal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import linkedinIcon from '$lib/assets/icons/linkedln-icon.png';
	import facebookIcon from '$lib/assets/icons/facebook-icon.png';
	import instagramIcon from '$lib/assets/icons/instagram-icon.svg';
	import { SOCIAL_LINKS } from '$lib/constants';

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
			<a
				href={SOCIAL_LINKS.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				class="flex flex-col items-center gap-2"
			>
				<div class="size-13 rounded-full bg-white shadow-lg flex items-center justify-center">
					<img src={linkedinIcon} alt="LinkedIn" class="size-[18px] object-contain" />
				</div>
				<span class="text-[14px] text-[#253B4B]">LinkedIn</span>
			</a>
			<a
				href={SOCIAL_LINKS.facebook}
				target="_blank"
				rel="noopener noreferrer"
				class="flex flex-col items-center gap-2"
			>
				<div class="size-13 rounded-full bg-white shadow-lg flex items-center justify-center">
					<img src={facebookIcon} alt="Facebook" class="size-[18px] object-contain" />
				</div>
				<span class="text-[14px] text-[#253B4B]">Facebook</span>
			</a>
			<a
				href={SOCIAL_LINKS.instagram}
				target="_blank"
				rel="noopener noreferrer"
				class="flex flex-col items-center gap-2"
			>
				<div class="size-13 rounded-full bg-white shadow-lg flex items-center justify-center">
					<img src={instagramIcon} alt="Instagram" class="size-[18px] object-contain" />
				</div>
				<span class="text-[14px] text-[#253B4B]">Instagram</span>
			</a>
		</div>
	</div>
</BaseModal>
