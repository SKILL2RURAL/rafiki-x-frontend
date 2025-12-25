<script lang="ts">
	import { api } from '$lib/api';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { profile, uploadProfilePhoto, fetchProfile } from '$lib/stores/profile';
	import { ChevronRight } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import ChangeEmailModal from './ChangeEmailModal.svelte';
	import ChangeNameModal from './ChangeNameModal.svelte';
	import ChangePasswordModal from './ChangePasswordModal.svelte';
	import DeleteAccountConfirmDialog from './DeleteAccountConfirmDialog.svelte';
	import PersonCircle from '$lib/assets/icons/person-circle.png';
	import EnvelopeFill from '$lib/assets/icons/envelope-fill.png';
	import LockFill from '$lib/assets/icons/lock-fill.png';
	import TrashFill from '$lib/assets/icons/trash-fill.png';
	import DefualtProfileImage from '$lib/assets/icons/default-profile.png';
	import { cn } from '$lib/utils';

	let isDeleteDialogOpen = $state(false);
	let isChangePasswordModalOpen = $state(false);
	let isChangeNameModalOpen = $state(false);
	let isChangeEmailModalOpen = $state(false);
	let isUploading = $state(false);

	let form = $state({
		firstName: '',
		lastName: '',
		email: '',
		country: '',
		gender: '',
		ageGroup: '',
		profilePhoto: ''
	});

	// Initialize form from profile store
	$effect(() => {
		if ($profile.data) {
			form = {
				firstName: $profile.data.firstName || '',
				lastName: $profile.data.lastName || '',
				email: $profile.data.email || '',
				country: $profile.data.country || '',
				gender: $profile.data.gender || '',
				ageGroup: $profile.data.ageGroup || '',
				profilePhoto: $profile.data.profilePhoto || ''
			};
		}
	});

	async function handleFileChange(event: Event) {
		try {
			isUploading = true;

			const input = event.target as HTMLInputElement;
			if (!input?.files?.length) return;

			const file = input.files[0];
			if (!file.type.startsWith('image/')) {
				toast.error('Please upload a valid image file.');
				return;
			}

			const uploadedUrl = await uploadProfilePhoto(file);
			if (uploadedUrl) {
				await api.put('/user/profile', { profilePhoto: uploadedUrl });
				toast.success('Profile photo updated!');

				// Optimistic UI update
				form.profilePhoto = uploadedUrl;

				await fetchProfile();
			}
		} catch (error: any) {
			console.error('Error updating profile photo:', error?.response?.data || error);
			toast.error('Failed to update profile photo.');
		} finally {
			isUploading = false;
		}
	}
</script>

<!-- ✅ Profile picture section -->
<div>
	<p class="text-[#253B4B] text-[18px] font-light mb-3">Profile picture</p>
	<div class={cn('flex items-center gap-4 mb-5', { 'opacity-50': isUploading })}>
		<!-- PROFILE IMAGE  -->
		<div class={cn('w-20 h-20 rounded-full', { 'opacity-50': isUploading })}>
			{#if form.profilePhoto}
				<Avatar.Root class="w-20 h-20">
					<Avatar.Image src={form.profilePhoto} alt="profile" />
					<Avatar.Fallback>{form.firstName?.[0] + form.lastName?.[0]}</Avatar.Fallback>
				</Avatar.Root>
			{:else}
				<img src={DefualtProfileImage} alt="profile" class="w-20 h-20 rounded-full" />
			{/if}
		</div>

		<div class="space-y-2">
			<p class="text-[#808990]">Must be JPG, PNG, 2MB Max</p>
			<label
				class="text-[#253B4B] text-[14px] font-normal border border-[#808990] rounded-[4px] p-2 cursor-pointer"
			>
				<input
					type="file"
					disabled={isUploading}
					accept="image/*"
					onchange={handleFileChange}
					class="hidden"
				/>
				Change Picture
			</label>
		</div>
	</div>
</div>

<!-- Basic Information Section -->
<div class="shadow-md rounded-[20px] p-10">
	<h3 class="text-[#253B4B] text-[18px] font-semibold font-mulish">Basic information</h3>
	<button
		class="flex justify-between items-center py-5 border-b border-[#E8E8E8] w-full"
		onclick={() => (isChangeNameModalOpen = true)}
	>
		<div class="flex space-x-5 items-center">
			<img src={PersonCircle} alt="profile" class="w-[20px] h-[20px]" />
			<div class="flex flex-col items-start">
				<h5 class="text-[#253B4B] text-[18px] font-medium">
					{$profile.data?.firstName + ' ' + $profile.data?.lastName}
				</h5>
				<p class="text-[#808990] text-[14px] font-satoshi-regular">Full name</p>
			</div>
		</div>
		<div class="hidden lg:block">
			<div class="bg-gradient rounded-full cursor-pointer p-1">
				<ChevronRight color="white" size={25} />
			</div>
		</div>
	</button>

	<button
		onclick={() => (isChangeEmailModalOpen = true)}
		class="flex justify-between items-center py-5 w-full"
	>
		<div class="flex space-x-5 items-center">
			<img src={EnvelopeFill} alt="profile" class="w-[20px] h-[20px]" />
			<div class="text-start">
				<h5
					class="text-[#253B4B] text-[18px] font-medium max-w-[250px] lg:max-w-[300px] md:w-full truncate"
				>
					{$profile.data?.email}
				</h5>
				<p class="text-[#808990] text-[14px] font-satoshi-regular">Email address</p>
			</div>
		</div>
	</button>

	<div>
		<h3 class="text-[#253B4B] text-[18px] font-medium">Security</h3>
		<button
			onclick={() => (isChangePasswordModalOpen = true)}
			class="flex justify-between items-center py-5 w-full"
		>
			<div class="flex space-x-5 items-center">
				<img src={LockFill} alt="profile" class="w-[20px] h-[20px]" />
				<div>
					<h5 class="text-[#253B4B] text-[18px] font-medium text-left">Password</h5>
					<p class="text-[#808990] text-[14px] font-satoshi-regular text-left">
						Change your account password
					</p>
				</div>
			</div>
			<div class="hidden lg:block">
				<div class="bg-gradient rounded-full cursor-pointer p-1">
					<ChevronRight color="white" size={25} />
				</div>
			</div>
		</button>
	</div>

	<!-- Danger Zone -->
	<div>
		<h3 class="text-[#253B4B] text-[18px] font-medium">Danger Zone</h3>
		<button
			class="flex justify-between items-center py-5 w-full"
			onclick={() => (isDeleteDialogOpen = true)}
		>
			<div class="flex space-x-5 items-center">
				<img src={TrashFill} alt="profile" class="w-[20px] h-[20px]" />
				<div>
					<h5 class="text-[#DE1106] text-[18px] font-medium text-left">Delete account</h5>
					<p class="text-[#808990] text-[14px] font-satoshi-regular text-left">
						You won't be able to undo this action if you continue.
					</p>
				</div>
			</div>
			<div class="hidden lg:block">
				<div class="bg-gradient rounded-full cursor-pointer p-1">
					<ChevronRight color="white" size={25} />
				</div>
			</div>
		</button>
	</div>
</div>

<!-- Modals -->
<DeleteAccountConfirmDialog
	isOpen={isDeleteDialogOpen}
	onClose={() => (isDeleteDialogOpen = false)}
/>
<ChangePasswordModal
	isOpen={isChangePasswordModalOpen}
	onClose={() => (isChangePasswordModalOpen = false)}
/>
<ChangeNameModal
	isOpen={isChangeNameModalOpen}
	onClose={() => (isChangeNameModalOpen = false)}
/>
<ChangeEmailModal
	isOpen={isChangeEmailModalOpen}
	onClose={() => (isChangeEmailModalOpen = false)}
/>

