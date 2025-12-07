<script lang="ts">
	import type { Currency } from './types';

	export let selected: Currency = 'naira';

	function toggle(currency: Currency) {
		selected = currency;
	}
</script>

<div
	class="inline-flex rounded-full bg-[#F7FBFD] border-[#E8E8E8] border-2 p-3 text-[16px]"
	style="font-family: 'Mullish', sans-serif;"
>
	<button
		on:click={() => toggle('naira')}
		class="rounded-full px-8 py-2 text-sm font-medium transition-all {selected === 'naira'
			? 'bg-white text-[#253B4B]'
			: 'text-[#808990]'}"
	>
		Naira
	</button>
	<button
		on:click={() => toggle('dollars')}
		class="rounded-full px-8 py-2 text-sm font-medium transition-all {selected === 'dollars'
			? 'bg-white text-[#253B4B] font'
			: 'text-[#808990]'}"
	>
		Dollars
	</button>
</div>
