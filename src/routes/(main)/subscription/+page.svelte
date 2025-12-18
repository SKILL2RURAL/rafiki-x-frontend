<script lang="ts">
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import { X } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { BillingPeriod, Currency } from '../../../components/main/subscription/types';
	import PricingCard from '../../../components/main/subscription/PricingCard.svelte';
	import PricingCardSkeleton from '../../../components/main/subscription/PricingCardSkeleton.svelte';
	import CurrencyToggle from '../../../components/main/subscription/CurrencyToggle.svelte';
	import {
		subscriptionPlans,
		fetchSubscriptionPlans,
		fetchSubscriptionStatus,
		generateFeatures,
		getSupportPlanPrice,
		currentPlan
	} from '../../../lib/stores/subscription';

	let currency: Currency = 'naira';
	let freePlanPeriod: BillingPeriod = 'monthly';
	let supportPlanPeriod: BillingPeriod = 'yearly';

	// Reactive stores
	$: plans = $subscriptionPlans.plans;
	$: isLoading = $subscriptionPlans.isLoading;
	$: error = $subscriptionPlans.error;
	$: userCurrentPlan = $currentPlan;

	// Get price for support plan based on currency and billing period
	$: supportPrice = getSupportPlanPrice(plans, supportPlanPeriod, currency);

	// Get free plan features
	$: freePlanFeatures = plans?.free ? generateFeatures(plans.free.limits) : [];

	// Get support plan features
	$: supportPlanFeatures = plans?.support ? generateFeatures(plans.support.limits) : [];

	// Determine which plan is current
	$: isFreePlanCurrent = userCurrentPlan === 'FREE';
	$: isSupportPlanCurrent = userCurrentPlan === 'SUPPORT';

	function handleClose() {
		goto('/');
	}

	function handleUpgrade() {
		console.log('Upgrade to Support plan');
		// Add your upgrade logic here
	}

	function handleRetry() {
		fetchSubscriptionPlans();
	}

	onMount(() => {
		fetchSubscriptionPlans();
		fetchSubscriptionStatus();
	});
</script>

<Layout>
	<!-- Header -->
	<div class="relative p-5 md:p-10" style="font-family: 'Impact', sans-serif;">
		<div class="text-center">
			<h1 class="text-2xl md:text-3xl mb-5 font-black text-[#253B4B]">Upgrade Your RafikiX Plan</h1>
			<div class="flex justify-center"><CurrencyToggle bind:selected={currency} /></div>
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
					onclick={handleRetry}
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
				isCurrentPlan={isFreePlanCurrent}
			/>

			<PricingCard
				title={plans.support.name}
				price={supportPrice}
				{currency}
				bind:billingPeriod={supportPlanPeriod}
				description={plans.support.description}
				features={supportPlanFeatures}
				buttonText={isSupportPlanCurrent ? 'Current Plan' : 'Upgrade to Plan'}
				buttonVariant={isSupportPlanCurrent ? 'outline' : 'default'}
				highlighted={true}
				isCurrentPlan={isSupportPlanCurrent}
				on:upgrade={handleUpgrade}
			/>
		</div>
	{/if}

	<!-- Footer -->
	<p class="mt-8 px-4 text-center text-sm text-gray-600">
		By messaging RafikiX, you agree to our Terms and Conditions
	</p>
</Layout>
