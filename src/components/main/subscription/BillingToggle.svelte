<script lang="ts">
	import type { BillingPeriod } from './types';

	export let selected: BillingPeriod = 'monthly';

	function toggle(period: BillingPeriod) {
		selected = period;
	}
</script>

<div class="flex items-center gap-3 text-sm">
	<button
		on:click={() => toggle('monthly')}
		class="font-medium transition-colors {selected === 'monthly'
			? 'text-gray-900'
			: 'text-gray-500 hover:text-gray-700'}"
	>
		Monthly
	</button>

	<button
		aria-label="switch button"
		on:click={() => toggle(selected === 'monthly' ? 'yearly' : 'monthly')}
		class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {selected ===
		'yearly'
			? 'bg-indigo-600'
			: 'bg-gray-300'}"
		role="switch"
		aria-checked={selected === 'yearly'}
	>
		<span
			class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {selected ===
			'yearly'
				? 'translate-x-6'
				: 'translate-x-1'}"
		></span>
	</button>

	<button
		on:click={() => toggle('yearly')}
		class="font-medium transition-colors {selected === 'yearly'
			? 'text-gray-900'
			: 'text-gray-500 hover:text-gray-700'}"
	>
		Yearly
	</button>
</div>
