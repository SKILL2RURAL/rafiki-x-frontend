<script lang="ts">
	import BaseModal from '../Layout/BaseModal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CancelPlanConfirmationModal from './CancelPlanConfirmationModal.svelte';
	import { subscriptionStatus } from '$lib/stores/subscription';
	import logo from '$lib/assets/icons/logo-with-name.png';

	let {
		isOpen = false,
		onClose = () => {},
		onCancelPlan = () => {}
	}: {
		isOpen?: boolean;
		onClose?: () => void;
		onCancelPlan?: () => void;
	} = $props();

	let isConfirmationOpen = $state(false);

	const subscription = $derived($subscriptionStatus.status);

	const billingCycle = $derived(subscription?.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly');
	const currencySymbol = $derived(subscription?.currency === 'NGN' ? '₦' : '$');
	const amount = $derived(subscription?.amount ?? 0);
	const displayAmount = $derived(amount.toLocaleString());
	const isCancelled = $derived(subscription?.cancelled ?? false);
	const isStatusCancelled = $derived(subscription?.status === 'CANCELLED');

	const nextBillingDate = $derived(
		subscription?.endDate
			? new Date(subscription.endDate).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
			: 'N/A'
	);

	const cancelledDate = $derived(
		subscription?.cancelledAt
			? new Date(subscription.cancelledAt).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
			: null
	);

	function handleCancelPlan() {
		// Close the manage plan modal and open confirmation modal
		onClose();
		isConfirmationOpen = true;
	}

	function handleConfirmCancel() {
		// User confirmed, proceed with cancellation
		onCancelPlan();
		onClose();
	}
</script>

<BaseModal {isOpen} title="Manage Plan" {onClose}>
	<div class="mt-6">
		<!-- Plan Details Card -->
		<div class="bg-white rounded-xl p-5 mb-6">
			<div class="flex items-center gap-3 mb-4">
				<img src={logo} alt="Rafiki" class="w-10 h-10 object-contain" />
				<div class="flex-1">
					<div class="flex items-center gap-2">
						<p
							class="text-[#253B4B] font-medium text-[16px]"
							style="font-family: 'Impact', sans-serif;"
						>
							Support Plan
						</p>
						{#if isCancelled || isStatusCancelled}
							<span class="px-2 py-1 rounded text-[12px] bg-yellow-100 text-yellow-700 font-medium">
								CANCELLED
							</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-[#253B4B] text-[16px] font-medium">
					Billed {billingCycle} |
					<span class="font-semibold text-[#253B4B] text-[26px]"
						>{currencySymbol}{displayAmount}</span
					>
				</p>
				{#if isCancelled || isStatusCancelled}
					<p class="text-[#253B4B] text-[16px] font-medium">
						Access until: {nextBillingDate}
					</p>
					{#if cancelledDate}
						<p class="text-[#808990] text-[14px]">Cancelled on: {cancelledDate}</p>
					{/if}
				{:else}
					<p class="text-[#253B4B] text-[16px] font-medium">Next billing date: {nextBillingDate}</p>
				{/if}
			</div>
		</div>

		<!-- Cancel Plan Button -->
		{#if !isCancelled && !isStatusCancelled}
			<Button
				class="bg-gradient w-full rounded-[12px] h-[48px] border border-[#FFFFFF] mb-4"
				onclick={handleCancelPlan}
			>
				Cancel Plan
			</Button>
		{/if}

		<!-- Cancellation Info -->
		{#if isCancelled || isStatusCancelled}
			<p
				class="text-[#253B4B] bg-yellow-50 border border-yellow-200 text-[16px] rounded-[10px] p-4 text-left leading-relaxed"
			>
				Your subscription has been cancelled. You'll continue to have access to support features
				until {nextBillingDate}. After that, you'll be moved to the free plan. You can re-activate
				your subscription anytime before the end date.
			</p>
		{:else}
			<p
				class="text-[#253B4B] bg-[#EEF6FB] text-[16px] rounded-[10px] p-4 text-left leading-relaxed"
			>
				Your support plan is currently active. If you cancel, you'll lose access to support features
				at the end of your current billing period. You can re-activate anytime.
			</p>
		{/if}
	</div>
</BaseModal>

<CancelPlanConfirmationModal
	isOpen={isConfirmationOpen}
	onClose={() => (isConfirmationOpen = false)}
	onConfirm={handleConfirmCancel}
/>
