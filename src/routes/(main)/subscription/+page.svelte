<script lang="ts">
	import { X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import CreateAccountModal from '../../../components/main/Layout/CreateAccountModal.svelte';
	import ManagePlanModal from '../../../components/main/subscription/ManagePlanModal.svelte';
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import CurrencyToggle from '../../../components/main/subscription/CurrencyToggle.svelte';
	import PricingCard from '../../../components/main/subscription/PricingCard.svelte';
	import PricingCardSkeleton from '../../../components/main/subscription/PricingCardSkeleton.svelte';
	import {
		handlePaymentCallback,
		handleRetry,
		handleSupportPlanAction,
		handleCancel,
		handleRenew
	} from '../../../components/main/subscription/subscriptionUtils';
	import type { BillingPeriod, Currency } from '../../../components/main/subscription/types';
	import { auth } from '../../../lib/stores/authStore';
	import {
		currentPlan,
		fetchSubscriptionPlans,
		fetchSubscriptionStatus,
		generateFeatures,
		getSupportPlanPrice,
		isSubscriptionCancelled,
		subscriptionPlans,
		subscriptionStatus
	} from '../../../lib/stores/subscription';

	let currency = $state<Currency>('naira');
	let freePlanPeriod = $state<BillingPeriod>('monthly');
	let supportPlanPeriod = $state<BillingPeriod>('yearly');
	let isCreateAccountOpen = $state(false);
	let isManagePlanOpen = $state(false);
	let isInitializing = $state({ value: false });
	let isCancelling = $state({ value: false });

	// Reactive stores
	const plans = $derived($subscriptionPlans.plans);
	const isLoading = $derived($subscriptionPlans.isLoading);
	const error = $derived($subscriptionPlans.error);
	const userCurrentPlan = $derived($currentPlan);
	const isAuthenticated = $derived(!!$auth.accessToken);

	// Get price for support plan based on currency and billing period
	// const supportPrice = $derived(getSupportPlanPrice(plans, supportPlanPeriod, currency));
	const supportPrice = $derived(plans?.support?.paystackPricing[supportPlanPeriod]?.ngn || 0);
	// Get free plan features
	const freePlanFeatures = $derived(plans?.free ? generateFeatures(plans.free.limits) : []);

	// Get support plan features
	const supportPlanFeatures = $derived(
		plans?.support ? generateFeatures(plans.support.limits) : []
	);

	// Determine which plan is current
	const isFreePlanCurrent = $derived(userCurrentPlan === 'FREE');
	const isSupportPlanCurrent = $derived(userCurrentPlan === 'SUPPORT');
	const isCancelled = $derived($isSubscriptionCancelled);
	const subscription = $derived($subscriptionStatus.status);

	// Check if subscription is cancelled and hasn't passed end date
	const canRenew = $derived.by(() => {
		if (!isCancelled || !subscription?.endDate) return false;
		const endDate = new Date(subscription.endDate);
		const now = new Date();
		return endDate > now; // Can renew if end date is in the future
	});

	const endDateFormatted = $derived.by(() => {
		if (!subscription?.endDate) return null;
		return new Date(subscription.endDate).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	});

	// Track previous plan to detect changes
	let previousPlan = $state<string | undefined>(undefined);

	// Reset loading state when plan changes (after cancellation/upgrade)
	$effect(() => {
		const currentPlan = userCurrentPlan;
		if (previousPlan !== undefined && previousPlan !== currentPlan) {
			// Plan has changed, reset loading states
			isCancelling.value = false;
			isInitializing.value = false;
		}
		previousPlan = currentPlan;
	});

	async function onSupportPlanAction() {
		await handleSupportPlanAction(
			isSupportPlanCurrent,
			isAuthenticated,
			supportPlanPeriod,
			currency,
			() => (isCreateAccountOpen = true),
			isInitializing,
			isCancelling,
			isCancelled
		);
	}

	async function onFreePlanAction() {
		if (isSupportPlanCurrent) {
			// If on support plan, cancel it when selecting free plan
			await handleCancel(isAuthenticated, () => (isCreateAccountOpen = true), isCancelling);
		}
	}

	async function onRenewPlan() {
		await handleRenew(
			isAuthenticated,
			supportPlanPeriod,
			currency,
			() => (isCreateAccountOpen = true),
			isInitializing
		);
	}

	function onManagePlan() {
		// Open manage plan modal
		isManagePlanOpen = true;
	}

	async function onCancelPlan() {
		// Handle cancel plan action from modal
		await handleCancel(isAuthenticated, () => (isCreateAccountOpen = true), isCancelling);
	}

	onMount(() => {
		fetchSubscriptionPlans();
		fetchSubscriptionStatus();
		handlePaymentCallback(isInitializing);
	});
</script>

<Layout>
	<!-- Header -->
	<div class="relative p-5 md:p-10" style="font-family: 'Impact', sans-serif;">
		<div class="text-center">
			<h1 class="text-2xl md:text-3xl mb-5 font-black text-[#253B4B]">Upgrade Your RafikiX Plan</h1>
			<!-- <div class="flex justify-center"><CurrencyToggle bind:selected={currency} /></div> -->
		</div>

		<!-- Close Button -->
		<a href="/">
			<div
				class="absolute top-2 right-2 md:top-0 md:right-0 rounded-full size-[34px] flex items-center justify-center bg-gradient"
			>
				<X color="white" />
			</div>
		</a>
	</div>

	<!-- Pricing Cards -->
	{#if isLoading}
		<div
			class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 px-4 sm:px-8 md:px-20 max-w-6xl mx-auto"
		>
			<PricingCardSkeleton />
			<PricingCardSkeleton />
		</div>
	{:else if error}
		<div class="flex justify-center items-center min-h-[400px]">
			<div class="text-center">
				<p class="text-red-600 mb-4">{error}</p>
				<button
					onclick={() => handleRetry()}
					class="px-4 py-2 bg-[#51A3DA] text-white rounded-lg hover:bg-[#3d8bb8] transition-colors"
				>
					Try Again
				</button>
			</div>
		</div>
	{:else if plans}
		<div
			class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 px-4 sm:px-8 md:px-20 max-w-6xl mx-auto"
		>
			<PricingCard
				title={plans.free.name}
				price={plans.free.price}
				{currency}
				bind:billingPeriod={freePlanPeriod}
				description={plans.free.description}
				features={freePlanFeatures}
				buttonText={isFreePlanCurrent ? 'Current Plan' : 'Select Plan'}
				buttonVariant="outline"
				isCurrentPlan={isFreePlanCurrent || isSupportPlanCurrent}
				isLoading={isCancelling.value}
				on:upgrade={onFreePlanAction}
			/>

			<PricingCard
				title={plans.support.name}
				price={supportPrice}
				{currency}
				bind:billingPeriod={supportPlanPeriod}
				description={plans.support.description}
				features={supportPlanFeatures}
				buttonText={isCancelled && isSupportPlanCurrent
					? 'Renew Plan'
					: isSupportPlanCurrent
						? 'Current Plan'
						: 'Upgrade to Plan'}
				buttonVariant={isSupportPlanCurrent ? 'outline' : 'default'}
				highlighted={true}
				isCurrentPlan={isSupportPlanCurrent && !isCancelled}
				showManagePlan={isSupportPlanCurrent && !isCancelled}
				isLoading={isInitializing.value || isCancelling.value}
				on:upgrade={onSupportPlanAction}
				on:manage={onManagePlan}
			/>
		</div>
	{/if}

	<!-- Footer -->
	<p class="mt-8 px-4 text-center text-sm text-gray-600">
		By messaging RafikiX, you agree to our Terms and Conditions
	</p>
</Layout>

<CreateAccountModal isOpen={isCreateAccountOpen} onClose={() => (isCreateAccountOpen = false)} />

<ManagePlanModal
	isOpen={isManagePlanOpen}
	onClose={() => (isManagePlanOpen = false)}
	{onCancelPlan}
/>
