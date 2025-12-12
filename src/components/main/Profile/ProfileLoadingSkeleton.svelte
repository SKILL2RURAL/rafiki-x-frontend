<script lang="ts">
	let { class: className = '' } = $props();
</script>

<div class={`px-5 lg:px-10 space-y-6 ${className}`}>
	<div class="h-6 w-40 bg-muted rounded animate-pulse"></div>

	<div>
		<div class="h-5 w-56 bg-muted rounded mb-3 animate-pulse"></div>
		<div class="flex items-center gap-4 mb-5">
			<div class="size-20 rounded-full bg-muted animate-pulse"></div>
			<div class="space-y-2">
				<div class="h-4 w-48 bg-muted rounded animate-pulse"></div>
				<div class="h-8 w-32 bg-muted rounded animate-pulse"></div>
			</div>
		</div>
	</div>

	<div class="shadow-md rounded-[20px] p-10 space-y-6">
		<div class="h-5 w-40 bg-muted rounded animate-pulse"></div>

		<div class="space-y-4">
			<div class="flex justify-between items-center py-5 border-b border-[#E8E8E8] w-full">
				<div class="flex items-center gap-5">
					<div class="size-5 bg-muted rounded-full animate-pulse"></div>
					<div class="space-y-2">
						<div class="h-4 w-48 bg-muted rounded animate-pulse"></div>
						<div class="h-4 w-32 bg-muted rounded animate-pulse"></div>
					</div>
				</div>
				<div class="hidden lg:block">
					<div class="size-6 rounded-full bg-muted animate-pulse"></div>
				</div>
			</div>

			<div class="flex justify-between items-center py-5 w-full">
				<div class="flex items-center gap-5">
					<div class="size-5 bg-muted rounded-full animate-pulse"></div>
					<div class="space-y-2">
						<div class="h-4 w-56 bg-muted rounded animate-pulse"></div>
						<div class="h-4 w-40 bg-muted rounded animate-pulse"></div>
					</div>
				</div>
				<div class="hidden lg:block">
					<div class="size-6 rounded-full bg-muted animate-pulse"></div>
				</div>
			</div>

			<div class="space-y-2">
				<div class="h-5 w-40 bg-muted rounded animate-pulse"></div>
				<div class="flex justify-between items-center py-5 w-full">
					<div class="flex items-center gap-5">
						<div class="size-5 bg-muted rounded-full animate-pulse"></div>
						<div class="space-y-2">
							<div class="h-4 w-40 bg-muted rounded animate-pulse"></div>
							<div class="h-4 w-64 bg-muted rounded animate-pulse"></div>
						</div>
					</div>
					<div class="hidden lg:block">
						<div class="size-6 rounded-full bg-muted animate-pulse"></div>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<div class="h-5 w-40 bg-muted rounded animate-pulse"></div>
				<div class="flex justify-between items-center py-5 w-full">
					<div class="flex items-center gap-5">
						<div class="size-5 bg-muted rounded-full animate-pulse"></div>
						<div class="space-y-2">
							<div class="h-4 w-48 bg-muted rounded animate-pulse"></div>
							<div class="h-4 w-72 bg-muted rounded animate-pulse"></div>
						</div>
					</div>
					<div class="hidden lg:block">
						<div class="size-6 rounded-full bg-muted animate-pulse"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
