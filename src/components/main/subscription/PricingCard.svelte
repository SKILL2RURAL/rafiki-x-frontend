<script lang="ts">
	import AshBackground from '$lib/assets/img/ash-background.webp';
	import { Button } from '$lib/components/ui/button';
	import { createEventDispatcher } from 'svelte';
	import BillingToggle from './BillingToggle.svelte';
	import type { BillingPeriod, Currency } from './types';
	import Check from '$lib/assets/icons/green-check.png';

	export let title: string;
	export let price: number;
	export let currency: Currency;
	export let billingPeriod: BillingPeriod = 'monthly';
	export let description: string;
	export let features: string[] = [];
	export let buttonText: string;
	export let buttonVariant: 'default' | 'outline' = 'default';
	export let isCurrentPlan = false;
	export let highlighted = false;

	const dispatch = createEventDispatcher();

	$: displayPrice = price === 0 ? '0' : price.toLocaleString();
	$: currencySymbol = currency === 'naira' ? '₦' : '$';
	$: billingText = billingPeriod === 'monthly' ? 'billed monthly' : 'billed annually';

	function handleClick() {
		if (!isCurrentPlan) {
			dispatch('upgrade');
		}
	}
</script>

<div
	class="relative overflow-hidden shadow-xl rounded-[20px] z-0 transition-all {highlighted
		? 'bg-[#B2E0FF]'
		: 'bg-gray-50'}"
>
	{#if highlighted}
		<img
			src={AshBackground}
			alt=""
			width="40"
			height="50"
			class="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
		/>
	{/if}
	<div class="relative z-10 p-8 pb-20 flex-1">
		<!-- Card Header -->
		<div class="mb-6">
			<h2 class="mb-4 text-[32px] font-impact font-bold text-[#253B4B]">{title}</h2>
			<div class="mb-2 flex items-baseline">
				<span class="text-sm text-gray-600">{currencySymbol}</span>
				<span class="text-5xl font-bold text-gray-900">{displayPrice}</span>
				<span class="ml-2 text-sm text-[#667085]">/{billingText}</span>
			</div>

			<BillingToggle bind:selected={billingPeriod} />

			<p class="mt-4 text-sm text-gray-600">{description}</p>
		</div>

		<!-- CTA Button -->
		<Button
			variant={buttonVariant}
			class="mb-6 w-full h-[50px] rounded-[8px] {highlighted
				? 'bg-white text-[#51A3DA] hover:bg-gray-50'
				: 'border border-[#C4C4C4]'}"
			disabled={isCurrentPlan}
			onclick={handleClick}
		>
			{buttonText}
		</Button>

		<!-- Features List -->
		<ul class="space-y-3">
			{#each features as feature}
				<li class="flex items-start gap-3">
					<div class="bg-[#D1FADF] rounded-full size-[24px] flex items-center justify-center">
						<img src={Check} alt="" width="13" height="13" />
					</div>
					<span class="text-[16px] font-normal text-[#667085]">{feature}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
