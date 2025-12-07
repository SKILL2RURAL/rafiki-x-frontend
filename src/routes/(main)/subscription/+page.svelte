<script lang="ts">
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import { X } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { BillingPeriod, Currency } from '../../../components/main/subscription/types';
	import PricingCard from '../../../components/main/subscription/PricingCard.svelte';
	import CurrencyToggle from '../../../components/main/subscription/CurrencyToggle.svelte';

	let currency: Currency = 'naira';
	let freePlanPeriod: BillingPeriod = 'monthly';
	let plusPlanPeriod: BillingPeriod = 'yearly';

	const freePlanFeatures = [
		'Get simple explanations',
		'Have short chats for common questions',
		'Try out image generation',
		'Save limited memory and context'
	];

	const plusPlanFeatures = [
		'Go deep on harder questions',
		'Chat longer and upload more content',
		'Make realistic images for your projects',
		'Store more context for smarter replies',
		'Explore projects, tasks, and custom GPTs'
	];

	function handleClose() {
		goto('/'); // Navigate back to home or previous page
	}

	function handleUpgrade() {
		console.log('Upgrade to Plus plan');
		// Add your upgrade logic here
	}
</script>

<Layout>
	<!-- Header -->
	<div class="relative p-10" style="font-family: 'Impact', sans-serif;">
		<div class="text-center">
			<h1 class="text-3xl mb-5 font-black text-[#253B4B]">Upgrade Your RafikiX Plan</h1>
			<CurrencyToggle bind:selected={currency} />
		</div>

		<!-- Close Button -->
		<a href="/">
			<div
				class="absolute top-0 right-0 rounded-full size-[34px] flex items-center justify-center bg-gradient"
			>
				<X color="white" />
			</div>
		</a>
	</div>

	<!-- Pricing Cards -->
	<div class="grid gap-12 md:grid-cols-2 px-20">
		<PricingCard
			title="Free"
			price={0}
			{currency}
			bind:billingPeriod={freePlanPeriod}
			description="See what RafikiX can do"
			features={freePlanFeatures}
			buttonText="Current Plan"
			buttonVariant="outline"
			isCurrentPlan={true}
		/>

		<PricingCard
			title="Plus"
			price={currency === 'naira' ? 19200 : 12}
			{currency}
			bind:billingPeriod={plusPlanPeriod}
			description="Do more with RafikiX Plus"
			features={plusPlanFeatures}
			buttonText="Upgrade to Plan"
			buttonVariant="default"
			highlighted={true}
			on:upgrade={handleUpgrade}
		/>
	</div>

	<!-- Footer -->
	<p class="mt-8 text-center text-sm text-gray-600">
		By messaging RafikiX, you agree to our Terms and Conditions
	</p>
</Layout>
