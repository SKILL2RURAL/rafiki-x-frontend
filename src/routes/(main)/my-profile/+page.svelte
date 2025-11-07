<script>
	import { onMount } from 'svelte';
	import { profile, fetchProfile } from '$lib/stores/profile';
	import { ChevronRight, Lock, Mail, Trash2 } from 'lucide-svelte';
	import Layout from '../../../components/Layout/Layout.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import DeleteAccountConfirmDialog from '../../../components/Profile/DeleteAccountConfirmDialog.svelte';
	import ChangePasswordModal from '../../../components/Profile/ChangePasswordModal.svelte';

	let isDeleteDialogOpen = $state(false);
	let isChangePasswordModalOpen = $state(false);

	onMount(() => {
		fetchProfile();
		
	});

</script>

<Layout>
	{#if $profile.isLoading}
		<p class="text-gray-500">Loading profile...</p>

	{:else if $profile.error}
		<p class="text-red-500">{$profile.error}</p>

	{:else if $profile.data}
		<div class="lg:px-10">
			<h1 class="text-[#253B4B] text-[24px] font-normal mb-5">My Account</h1>

			<div>
				<p class="text-[#253B4B] text-[18px] font-light mb-3">Profile picture</p>
				<div class="flex items-cente gap-4 mb-5">
					<Avatar.Root class="w-20 h-20">
						<Avatar.Image src={"https://github.com/shadcn.png"} alt={$profile.data.name || "@shadcn"} />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<div class="space-y-2">
						<p class="text-[#808990]">Must be JPG, PNG, 2MB Max</p>
						<button
							class="text-[#253B4B] text-[14px] font-normal border border-[#808990] rounded-[4px] p-2"
						>
							Change Picture
						</button>
					</div>
				</div>
			</div>

			<div class="shadow-md rounded-[20px] p-10">
				<h3 class="text-[#253B4B] text-[18px] font-semibold font-mulish">Basic information</h3>
				<div class="flex justify-between items-center py-5 border-b border-[#E8E8E8]">
					<div class="flex space-x-5 items-center">
						<Avatar.Root class="w-10 h-10">
							<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
						<div>
							<h5 class="text-[#253B4B] text-[18px] font-medium">{$profile.data.firstName + " " + $profile.data.lastName }</h5>
							<p class="text-[#808990] text-[14px] font-satoshi-regular">Full name</p>
						</div>
					</div>
					<div class="hidden lg:block">
						<button class="bg-gradient rounded-full cursor-pointer p-1">
							<ChevronRight color="white" size={25} />
						</button>
					</div>
				</div>

				<div class="flex justify-between items-center py-5">
					<div class="flex space-x-5 items-center">
						<Mail color="#808990" />
						<div>
							<h5 class="text-[#253B4B] text-[18px] font-medium max-w-[200px] md:w-full truncate">
								{$profile.data.email}
							</h5>
							<p class="text-[#808990] text-[14px] font-satoshi-regular">Email address</p>
						</div>
					</div>
					<div class="hidden lg:block">
						<button class="bg-gradient rounded-full cursor-pointer text-white px-4 text-[12px]"
							>Default</button
						>
					</div>
				</div>

				<div>
					<h3 class="text-[#253B4B] text-[18px] font-medium">Security</h3>
					<button
						onclick={() => (isChangePasswordModalOpen = true)}
						class="flex justify-between items-center py-5 w-full"
					>
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

				<div>
					<h3 class="text-[#253B4B] text-[18px] font-medium">Danger Zone</h3>
					<button
						class="flex justify-between items-center py-5 w-full"
						onclick={() => (isDeleteDialogOpen = true)}
					>
						<div class="flex space-x-5 items-center">
							<Trash2 color="#DE1106" />
							<div>
								<h5 class="text-[#DE1106] text-[18px] font-medium text-left">Delete account</h5>
								<p class="text-[#808990] text-[14px] font-satoshi-regular text-left">
									You won't be able to undo this action if you continue, and it may affect your future
									account with us
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

		<!-- Modals  -->
		<DeleteAccountConfirmDialog
			isOpen={isDeleteDialogOpen}
			onClose={() => {
				isDeleteDialogOpen = false;
			}}
		/>
		<ChangePasswordModal
			isOpen={isChangePasswordModalOpen}
			onClose={() => (isChangePasswordModalOpen = false)}
		/>

	{:else}
		<p>No profile data found.</p>
	{/if}
</Layout>
