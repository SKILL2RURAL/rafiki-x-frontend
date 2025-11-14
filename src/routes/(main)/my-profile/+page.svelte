<script>
	import { onMount } from 'svelte';
	import { profile, fetchProfile, uploadProfilePhoto } from '$lib/stores/profile';
	import { ChevronRight, Lock, Mail, Trash2 } from 'lucide-svelte';
	import Layout from '../../../components/Layout/Layout.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import DeleteAccountConfirmDialog from '../../../components/Profile/DeleteAccountConfirmDialog.svelte';
	import ChangePasswordModal from '../../../components/Profile/ChangePasswordModal.svelte';
	import ChangeNameModal from '../../../components/Profile/ChangeNameModal.svelte';
	import ChangeEmailModal from '../../../components/Profile/ChangeEmailModal.svelte';
	import { api } from '$lib/api';
	import { get } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	let isDeleteDialogOpen = $state(false);
	let isChangePasswordModalOpen = $state(false);
	let isChangeNameModalOpen = $state(false);
	let isChangeEmailModalOpen = $state(false);

	let form = {
		firstName: '',
		lastName: '',
		email: '',
		country: '',
		gender: '',
		ageGroup: '',
		profilePhoto: ''
	};

	onMount(async () => {
		await fetchProfile();
		const data = get(profile).data;
		if (data) {
			form = {
				firstName: data.firstName || '',
				lastName: data.lastName || '',
				email: data.email || '',
				country: data.country || '',
				gender: data.gender || '',
				ageGroup: data.ageGroup || '',
				profilePhoto: data.profilePhoto || ''
			};
		}
	});

	// ✅ Handle photo upload and profile update
	let isUploading = false;

	async function handleFileChange(event) {
		try {
			isUploading = true;
			const file = event.target.files?.[0];
			if (!file) return;

			if (!file.type.startsWith('image/')) {
				toast.error('Please upload a valid image file.');
				return;
			}

			const uploadedUrl = await uploadProfilePhoto(file);
			if (uploadedUrl) {
				// ✅ Partial update: Only send the changed field
				await api.put('/user/profile', { profilePhoto: uploadedUrl });
				toast.success('Profile photo updated!');
				
				// Optimistic UI update
				form.profilePhoto = uploadedUrl;
				
				await fetchProfile();  // Sync full profile from backend
			}
		} catch (error) {
			console.error('Error updating profile photo:', error.response?.data || error);
			toast.error('Failed to update profile photo.');
		} finally {
			isUploading = false;
		}
	}
</script>

<Layout>
	{#if $profile.isLoading}
		<p class="text-gray-500">Loading profile...</p>

	{:else if $profile.error}
		<p class="text-red-500">{$profile.error}</p>

	{:else if $profile.data}
		<div class="lg:px-10">
			<h1 class="text-[#253B4B] text-[24px] font-normal mb-5">My Account</h1>

			<!-- ✅ Profile picture section -->
			<div>
				<p class="text-[#253B4B] text-[18px] font-light mb-3">Profile picture</p>
				<div class="flex items-center gap-4 mb-5">
					<Avatar.Root class="w-20 h-20">
						<Avatar.Image src={form.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
						<Avatar.Fallback>{form.firstName?.[0] || '?'}</Avatar.Fallback>
					</Avatar.Root>
					<div class="space-y-2">
						<p class="text-[#808990]">Must be JPG, PNG, 2MB Max</p>
						<label class="text-[#253B4B] text-[14px] font-normal border border-[#808990] rounded-[4px] p-2 cursor-pointer">
							<input type="file" accept="image/*" onchange={handleFileChange} class="hidden" />
							Change Picture
						</label>
					</div>
				</div>
			</div>

			<!-- Basic Information Section -->
			<div class="shadow-md rounded-[20px] p-10">
				<h3 class="text-[#253B4B] text-[18px] font-semibold font-mulish">Basic information</h3>
				<div class="flex justify-between items-center py-5 border-b border-[#E8E8E8]">
					<div class="flex space-x-5 items-center">
						<Avatar.Root class="w-10 h-10">
							<Avatar.Image src={form.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
							<Avatar.Fallback>{form.firstName?.[0] || '?'}</Avatar.Fallback>
						</Avatar.Root>
						<button onclick={() => (isChangeNameModalOpen = true)}>
							<h5 class="text-[#253B4B] text-[18px] font-medium">
								{$profile.data.firstName + " " + $profile.data.lastName}
							</h5>
							<p class="text-[#808990] text-[14px] font-satoshi-regular">Full name</p>
						</button>
					</div>
					<div class="hidden lg:block">
						<button class="bg-gradient rounded-full cursor-pointer p-1">
							<ChevronRight color="white" size={25} />
						</button>
					</div>
				</div>

				<button onclick={() => (isChangeEmailModalOpen = true)} class="flex justify-between items-center py-5 w-full">
					<div class="flex space-x-5 items-center">
						<Mail color="#808990" />
						<div class="text-start">
							<h5 class="text-[#253B4B] text-[18px] font-medium max-w-[200px] md:w-full truncate">
								{$profile.data.email}
							</h5>
							<p class="text-[#808990] text-[14px] font-satoshi-regular">Email address</p>
						</div>
					</div>
					<div class="hidden lg:block">
						<div class="bg-gradient rounded-full cursor-pointer text-white px-4 text-[12px]">Default</div>
					</div>
				</button>

				<div>
					<h3 class="text-[#253B4B] text-[18px] font-medium">Security</h3>
					<button onclick={() => (isChangePasswordModalOpen = true)} class="flex justify-between items-center py-5 w-full">
						<div class="flex space-x-5 items-center">
							<Lock color="#808990" />
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
					<button class="flex justify-between items-center py-5 w-full" onclick={() => (isDeleteDialogOpen = true)}>
						<div class="flex space-x-5 items-center">
							<Trash2 color="#DE1106" />
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

	{:else}
		<p>No profile data found.</p>
	{/if}
</Layout>
