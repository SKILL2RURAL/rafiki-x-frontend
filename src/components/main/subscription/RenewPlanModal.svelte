<script lang="ts">
	import BaseModal from '../Layout/BaseModal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ReactivatePlanConfirmationModal from './ReactivatePlanConfirmationModal.svelte';
	import { subscriptionStatus, subscriptionPlans } from '$lib/stores/subscription';
	import type { BillingPeriod, Currency } from './types';
	import logo from '$lib/assets/icons/logo-with-name.png';

	let {
		isOpen = false,
		onClose = () => {},
		onRenewPlan = () => {},
		billingPeriod = 'monthly',
		currency = 'naira'
	}: {
		isOpen?: boolean;
		onClose?: () => void;
		onRenewPlan?: () => void;
		billingPeriod?: BillingPeriod;
		currency?: Currency;
	} = $props();

	let isConfirmationOpen = $state(false);
	const subscription = $derived($subscriptionStatus.status);
	const plans = $derived($subscriptionPlans.plans);

	const billingCycle = $derived(billingPeriod === 'monthly' ? 'Monthly' : 'Yearly');
	const currencySymbol = $derived(currency === 'naira' ? '₦' : '$');

	// Get price from the PricingCard's selected billing period and currency
	const amount = $derived.by(() => {
		if (!plans?.support) return 0;

		// Use paystackPricing for NGN, pricing for USD
		if (currency === 'naira') {
			return plans.support.paystackPricing[billingPeriod]?.ngn || 0;
		} else {
			return plans.support.pricing[billingPeriod]?.usd || 0;
		}
	});

	const displayAmount = $derived(amount.toLocaleString());
	const isCancelled = $derived(subscription?.cancelled ?? false);
	const isStatusCancelled = $derived(subscription?.status === 'CANCELLED');

	const endDate = $derived(
		subscription?.endDate
			? new Date(subscription.endDate).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
			: 'N/A'
	);

	// Calculate next billing date (assuming it's the same as endDate for reactivation)
	const nextBillingDate = $derived(
		subscription?.endDate
			? new Date(subscription.endDate).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
			: 'N/A'
	);

	function handleRenewPlan() {
		// Close the renew plan modal and open confirmation modal
		onClose();
		isConfirmationOpen = true;
	}

	function handleConfirmRenew() {
		// User confirmed, proceed with reactivation
		onRenewPlan();
		onClose();
	}
</script>

<BaseModal {isOpen} title="Renew Plan" {onClose}>
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
					</div>
				</div>
			</div>

			<div class="space-y-2 flex items-center gap-2">
				<p class="text-[#253B4B] text-[16px] font-medium">
					Billed {billingCycle} |
					<span class="font-semibold text-[#253B4B] text-[26px]"
						>{currencySymbol}{displayAmount}</span
					>
				</p>
				<span class="px-2 py-1 rounded-full text-[14px] bg-[#FF8D28] text-white font-medium">
					Paused
				</span>
			</div>
		</div>

		<!-- Renew Plan Button -->
		<Button
			class="bg-gradient w-full rounded-[12px] h-[48px] border border-[#FFFFFF] mb-4"
			onclick={handleRenewPlan}
		>
			Renew plan
		</Button>

		<!-- Renewal Info -->
		<div class="border border-dashed border-gray-300 bg-[#EEF6FB] p-5 rounded-[10px] pt-4">
			<p class="text-[#253B4B] text-[16px] mb-2 leading-relaxed">
				Your support plan next payment is currently paused. Renew to restore payment and continue
				access to support features. You can cancel anytime.
			</p>
			<p class="text-[#253B4B] text-[16px] font-medium">
				Upon renewal your next billing date will be {nextBillingDate}
			</p>
		</div>
	</div>
</BaseModal>

<ReactivatePlanConfirmationModal
	isOpen={isConfirmationOpen}
	onClose={() => (isConfirmationOpen = false)}
	onConfirm={handleConfirmRenew}
/>
