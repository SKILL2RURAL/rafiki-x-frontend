<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="space-y-3">
	<!-- Skeleton for chat history items -->
	{#each Array(3) as _}
		<div class="flex justify-between items-center w-full gap-5">
			<Skeleton class="h-4 w-full max-w-[200px]" />
			<Skeleton class="h-3 w-2" />
		</div>
	{/each}
</div>

