<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Check } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import BillingToggle from './BillingToggle.svelte';
	import type { Currency, BillingPeriod } from './types';
	import AshBackground from '$lib/assets/img/ash-background.webp';

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
	class="relative overflow-hidden rounded-[20px] z-0 transition-all {highlighted
		? 'bg-[#B2E0FF]'
		: 'bg-gray-50'}"
>
	{#if highlighted}
		<img
			src={AshBackground}
			alt=""
			width="40"
			height="50"
			class="absolute inset-0 w-full h-full object-cover z-0"
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
			class="mb-6 w-full h-[50px] {highlighted ? 'bg-white text-[#51A3DA] hover:bg-gray-50' : ''}"
			disabled={isCurrentPlan}
			onclick={handleClick}
		>
			{buttonText}
		</Button>

		<!-- Features List -->
		<ul class="space-y-3">
			{#each features as feature}
				<li class="flex items-start gap-3">
					<Check class="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
					<span class="text-sm text-gray-700">{feature}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
