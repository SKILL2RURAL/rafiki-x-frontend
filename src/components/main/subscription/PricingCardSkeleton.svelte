<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="relative overflow-hidden shadow-xl rounded-[20px] bg-gray-50">
	<div class="relative z-10 p-8 pb-20 flex-1">
		<!-- Card Header -->
		<div class="mb-6">
			<!-- Title -->
			<Skeleton class="mb-4 h-8 w-24" />
			
			<!-- Price -->
			<div class="mb-2 flex items-baseline gap-2">
				<Skeleton class="h-4 w-4" />
				<Skeleton class="h-12 w-32" />
				<Skeleton class="h-4 w-20" />
			</div>

			<!-- Billing Toggle -->
			<div class="flex items-center gap-3 mt-4">
				<Skeleton class="h-4 w-16" />
				<Skeleton class="h-6 w-11 rounded-full" />
				<Skeleton class="h-4 w-16" />
			</div>

			<!-- Description -->
			<Skeleton class="mt-4 h-4 w-full max-w-[200px]" />
		</div>

		<!-- CTA Button -->
		<Skeleton class="mb-6 w-full h-[50px] rounded-[8px]" />

		<!-- Features List -->
		<ul class="space-y-3">
			{#each Array(4) as _}
				<li class="flex items-start gap-3">
					<Skeleton class="size-[24px] rounded-full" />
					<Skeleton class="h-5 flex-1 max-w-[200px]" />
				</li>
			{/each}
		</ul>
	</div>
</div>

