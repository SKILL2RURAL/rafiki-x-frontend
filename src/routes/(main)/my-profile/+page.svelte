<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { fetchProfile, profile } from '$lib/stores/profile';
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import ProfileLoadingSkeleton from '../../../components/main/Profile/ProfileLoadingSkeleton.svelte';
	import ProfileTab from '../../../components/main/Profile/ProfileTab.svelte';
	import BillingsTab from '../../../components/main/Profile/BillingsTab.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let activeTab = $state<'profile' | 'billings'>('profile');

	onMount(async () => {
		await fetchProfile();
	});

	function refetchProfile() {
		fetchProfile();
	}
</script>

<Layout>
	{#if $profile.isLoading}
		<ProfileLoadingSkeleton />
	{:else if $profile.error}
		<div class="h-full flex flex-col items-center justify-center">
			<p>An error message</p>
			<Button
				class="my-5 bg-linear-to-r from-[#51A3DA] to-[#60269E] text-white"
				onclick={refetchProfile}>Try again</Button
			>
		</div>
	{:else if $profile.data}
		<div class="px-5 lg:px-10 my-5 lg:my-0">
			<!-- Header with Title and Avatar -->
			<div class="flex items-center justify-between mb-5">
				<h1
					class="text-[#253B4B] text-[24px] font-normal"
					style="font-family: 'Impact', sans-serif;"
				>
					My Account
				</h1>
			</div>

			<!-- Navigation Tabs -->
			<div class="flex gap-4 mb-6 bg-[#F4F4F5] rounded-[10px] p-3 w-fit">
				<button
					onclick={() => (activeTab = 'profile')}
					class={cn(
						'px-4 py-2 text-[16px] font-medium rounded-xl transition-colors relative',
						activeTab === 'profile' ? 'bg-[#F2F8FC]' : 'text-[#808990] hover:text-[#253B4B]'
					)}
					style={activeTab === 'profile'
						? 'border: 1px solid transparent; background-image: linear-gradient(#F2F8FC, #F2F8FC), linear-gradient(to right, #51A3DA, #195176); background-origin: border-box; background-clip: padding-box, border-box;'
						: ''}
				>
					{#if activeTab === 'profile'}
						<p class="bg-linear-to-r from-[#51A3DA] to-[#60269E] bg-clip-text text-transparent">
							Profile
						</p>
					{:else}
						<p>Profile</p>
					{/if}
				</button>
				<button
					onclick={() => (activeTab = 'billings')}
					class={cn(
						'px-4 py-2 text-[14px] md:text-[16px] font-medium rounded-xl transition-colors relative',
						activeTab === 'billings' ? 'bg-[#F2F8FC]' : 'text-[#808990] hover:text-[#253B4B]'
					)}
					style={activeTab === 'billings'
						? 'border: 1px solid transparent; background-image: linear-gradient(#F2F8FC, #F2F8FC), linear-gradient(to right, #51A3DA, #195176); background-origin: border-box; background-clip: padding-box, border-box;'
						: ''}
				>
					{#if activeTab === 'billings'}
						<p class="bg-linear-to-r from-[#51A3DA] to-[#60269E] bg-clip-text text-transparent">
							Billings
						</p>
					{:else}
						<p>Billings</p>
					{/if}
				</button>
			</div>

			<!-- Profile Tab Content -->
			{#if activeTab === 'profile'}
				<ProfileTab />
			{/if}

			<!-- Billings Tab Content -->
			{#if activeTab === 'billings'}
				<BillingsTab />
			{/if}
		</div>
	{/if}
</Layout>
