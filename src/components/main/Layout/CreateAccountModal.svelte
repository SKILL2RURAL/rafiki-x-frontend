<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import logo from '$lib/assets/icons/logo-with-name.png';
	import { X } from 'lucide-svelte';
	import linkedinIcon from '$lib/assets/icons/linkedln-icon.png';
	import facebookIcon from '$lib/assets/icons/facebook-icon.png';
	import instagramIcon from '$lib/assets/icons/instagram-icon.svg';
	import { SOCIAL_LINKS } from '$lib/constants';

	export let isOpen: boolean = false;
	export let onClose: () => void = () => {};

	function handleOpenChange(value: boolean) {
		if (!value) onClose();
	}
</script>

<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
	<Dialog.Overlay class="bg-black/30 backdrop-blur-md" />
	<Dialog.Content
		showCloseButton={false}
		class="rounded-[20px] p-0 border-0 max-w-md bg-linear-to-b from-[#5449AC] via-[#FFFFFF00] to-[#FFFFFF00] from-2% via-40% to-60% text-white min-w-[35vw]"
	>
		<div class="p-6">
			<Dialog.Header>
				<Dialog.Title
					class="text-center text-[32px] font-bold uppercase tracking-wide"
					style="font-family: 'Impact', sans-serif;"
				>
					Create an account
				</Dialog.Title>
				<Dialog.Description class="text-center text-white text-[14px]">
					New here? Join us by creating your account and unlock personalized career guidance
				</Dialog.Description>

				<button
					class="absolute right-5 top-7 bg-white rounded-full size-[32px] flex items-center justify-center"
					onclick={onClose}
				>
					<X class="text-black" size={20} />
				</button>
			</Dialog.Header>

			<div class="mt-4">
				<a href="/register">
					<Button class="bg-gradient w-full rounded-[12px] h-[48px] border border-[#FFFFFF]">
						Create an Account
					</Button>
				</a>
			</div>

			<div class="flex justify-center mt-6">
				<img src={logo} alt="Rafiki" class="w-[120px] h-[120px] object-contain" />
			</div>

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
	</Dialog.Content>
</Dialog.Root>
